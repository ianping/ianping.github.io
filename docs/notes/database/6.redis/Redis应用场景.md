---
title: Redis应用场景
createTime: 2024/11/24 15:56:14
permalink: /notes/database/973tb4a7/
---
参考：

+ 数据类型：https://redis.io/docs/data-types/
+ 命令大全：https://redis.io/commands/

## 缓存

将Java对象序列化为字符串，保存到Redis中，并设置缓存有效时间。

```java
/**
 * 获取用户信息:
 * 1.优先从Redis缓存中获取
 * 2.如果Redis中存在,直接返回; 如果不存在,再从数据库中查询,缓存到Redis并返回
 * */
private static UserInfo getUserInfo(Integer userId){
    String key = "u:info:" + userId;
    try (Jedis client = RedisUtils.jedis()){
        String value = client.get(key);
        if(value != null){
            return JsonUtils.deserialize(value, UserInfo.class);
        }else{
            UserInfo userInfo = selectUserInfo(userId);
            value = JsonUtils.serialize(userInfo);
            client.setex(key, 30 * 60L, value); // 缓存有效期30min
            return userInfo;
        }
    }
}

/**
 * 模拟查询数据库
 * */
private static UserInfo selectUserInfo(Integer userId){
    UserInfo userInfo = new UserInfo();
    userInfo.setId(userId);
    userInfo.setUsername("tom");
    userInfo.setAge(10);
    return userInfo;
}
```

## 计数器

使用string的`incr`命令，或者hash的`hincrby`命令实现计数器

```java
/**
 * 文章访问量计数器
 * */
private static Long incrPostVisitCount(Integer postId){
    String key = "post:visits";
    try (Jedis client = RedisUtils.jedis()){
        return client.hincrBy(key, String.valueOf(postId), 1);
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return null;
}

/**
 * 查询文章访问量
 * */
private static Long getPostVisitCount(Integer postId){
    String key = "post:visits";
    try (Jedis client = RedisUtils.jedis()){
        String value = client.hget(key, String.valueOf(postId));
        if(value != null){
            return Long.parseLong(value);
        }
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return null;
}
```

## HTTP Session共享

分布式系统中，将Session信息统一存储到Redis中，从而实现Session共享。

```java
/**
 * 缓存Session
 * */
private static void saveSession(Integer userId, String session){
    String key = "u:session";
    try(Jedis client = RedisUtils.jedis()) {
        client.hset(key, String.valueOf(userId), session);
    }catch(Exception ex){
        ex.printStackTrace();
    }
}

/**
 * 查询Session
 * */
private static String getSession(Integer userId){
    String key = "u:session";
    try(Jedis client = RedisUtils.jedis()) {
        return client.hget(key, String.valueOf(userId));
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return null;
}
```

## 限制频率

发送短信验证码接口中，限制每分钟最多只能向同一个手机号发送1条短信

```java
/**
 * 发送验证码,限制每分钟只能发送一次
 * */
private static void sendSMSVerification(String phone, String code) {
    String key = "sms:code:" + phone;
    try(Jedis client = RedisUtils.jedis()) {
        SetParams params = new SetParams();
        params.nx()       // 不存在
              .ex(60L);   // 过期时间60s
        String result = client.set(key, code, params);
        if("OK".equals(result)){
            System.out.println("发送验证码: " + code);
        }else{
            System.out.println("最近60s已经发送过1次验证码, 不允许发送");
        }
    } catch(Exception ex) {
        ex.printStackTrace();
    }
}

/**
 * 从Redis中查询验证码
 * */
private static String getSMSVerification(String phone){
    String key = "sms:code:" + phone;
    try(Jedis client = RedisUtils.jedis()) {
        return client.get(key);
    }catch(Exception ex) {
        ex.printStackTrace();
    }
    return null;
}
```

## 实现栈和队列数据结构

利用list可以实现栈和队列数据结构。

栈：`lpush` +`lpop`  或 `rpush`+`rpop`

队列：`lpush`+`rpop` 或 `rpush`+`lpop`

阻塞队列：`lpush`+`brpop` 或 `rpush`+`blpop`

以及用`exists`判断是否存在，`llen`查询集合大小。

## 排行榜

使用zset实现排行榜系统：最新文章排行榜、得分排行榜

```java
/**
 * 发布文章:
 * 1.保存文章信息
 * 2.添加文章到时间排行榜zset中
 * 3.添加文章到得分排行榜zset中
 * */
private static void addPost(Post post){
    String postInfoKey = "post:" + post.getId();      // 保存文章信息的hash
    String postRankingByTimeKey = "post:rank:time";   // 文章排行榜zset: 按照发布时间排序
    String postRankingByScoreKey = "post:rank:score"; // 文章排行榜zset: 按照得分排序

    try (Jedis client = RedisUtils.jedis()){
        client.hmset(postInfoKey, translatePost2Map(post));
        client.zadd(postRankingByTimeKey, post.getCreateTime(), postInfoKey);  // 分值为时间戳
        client.zadd(postRankingByScoreKey, post.getCreateTime(), postInfoKey); // 分值为时间戳
    }catch(Exception ex){
        ex.printStackTrace();
    }
}


/**
 * 投票:
 * 1.更新得分排行榜zset中相应的元素, 每得1票, 分值增加100
 * 2.更新文章信息hash, 票数加1
 * */
private static void votePost(Integer postId){
    String postInfoKey = "post:" + postId;
    String postRankingByScoreKey = "post:rank:score";
    try (Jedis client = RedisUtils.jedis()){
        client.zincrby(postRankingByScoreKey, 100, postInfoKey);
        client.hincrBy(postInfoKey, "votes", 1L);
    }catch(Exception ex){
        ex.printStackTrace();
    }
}

/**
 * 查询最新文章Top10:
 * 1.从文章发布时间排行榜zset中获取最新的10篇文章ID
 * 2.从hash查询每篇文章的详细信息
 * */
private static List<Post> latestPostRanking(){
    List<Post> posts = new ArrayList<>();

    String postRankingByTimeKey = "post:rank:time";
    try (Jedis client = RedisUtils.jedis()){
        List<String> postInfoKeys = client.zrevrange(postRankingByTimeKey, 0, 9);
        for(String postInfoKey : postInfoKeys) {
            Map<String, String> map = client.hgetAll(postInfoKey);
            String postId = postInfoKey.substring(postInfoKey.lastIndexOf(":") + 1);
            map.put("id", postId);
            posts.add(translateMap2Post(map));
        }
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return posts;
}


/**
 * 查询得分最高的文章Top10:
 * 1.从文章得分排行榜zset中获取得分最高的10篇文章ID
 * 2.从hash查询每篇文章的详细信息
 * */
private static List<Post> hotPostRanking(){
    List<Post> posts = new ArrayList<>();

    String postRankingByScoreKey = "post:rank:score";
    try (Jedis client = RedisUtils.jedis()){
        List<String> postInfoKeys = client.zrevrange(postRankingByScoreKey, 0, 9);
        for(String postInfoKey : postInfoKeys) {
            Map<String, String> map = client.hgetAll(postInfoKey);
            String postId = postInfoKey.substring(postInfoKey.lastIndexOf(":") + 1);
            map.put("id", postId);
            posts.add(translateMap2Post(map));
        }
    }catch(Exception ex){
        ex.printStackTrace();
    }
    return posts;
}


private static Map<String,String> translatePost2Map(Post post){
    return new HashMap<String,String>(){{
        put("title", post.getTitle());
        put("link", post.getLink());
        put("createTime", String.valueOf(post.getCreateTime()));
        put("votes", "0");
        put("userId", String.valueOf(post.getUserId()));
    }};
}

private static Post translateMap2Post(Map<String,String> map){
    Post post = new Post();
    post.setId(Integer.parseInt(map.get("id")));
    post.setTitle(map.get("title"));
    post.setLink(map.get("link"));
    post.setCreateTime(Long.parseLong(map.get("createTime")));
    post.setVotes(Integer.parseInt(map.get("votes")));
    post.setUserId(Integer.parseInt(map.get("userId")));
    return post;
}
```

