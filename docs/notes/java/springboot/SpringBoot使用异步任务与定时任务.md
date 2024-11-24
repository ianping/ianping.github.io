---
title: SpringBoot使用异步任务与定时任务
createTime: 2024/11/24 15:56:15
permalink: /notes/java/8cyncvyn/
---
## 异步任务

启用异步任务

```java
@SpringBootApplication
@EnableAsync
public class ScheduledTaskApp {
    public static void main(String[] args) {
        SpringApplication.run(ScheduledTaskApp.class, args);
    }
}
```

创建异步任务

```java
@Async
public void foo(){
    System.out.printf("[%s] [%s] foo()%n", datetimeFormatter.format(LocalDateTime.now()), Thread.currentThread().getName());
}
```

自定义线程池

```java
@Configuration
@EnableAsync
public class ThreadPollConfig{

    private final int PROCESSOR_SIZE = Runtime.getRuntime().availableProcessors();

    /**
     * 异步任务线程池
     */
    @Bean(name = "scheduledTaskExecutor")
    public Executor scheduledTaskExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(PROCESSOR_SIZE * 2);
        executor.setMaxPoolSize(PROCESSOR_SIZE * 5);
        executor.setKeepAliveSeconds(60);
        executor.setQueueCapacity(100);
        executor.setAllowCoreThreadTimeOut(true);
        executor.setPrestartAllCoreThreads(false);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setThreadNamePrefix("Scheduled-Task-");

        executor.initialize();
        return executor;
    }
}
```



## 定时任务

启用定时任务，推荐同时使用异步任务

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class ScheduledTaskApp {
    public static void main(String[] args) {
        SpringApplication.run(ScheduledTaskApp.class, args);
    }
}
```

创建定时任务

```java
@Component
public class ScheduledTaskService {

    private static final DateTimeFormatter datetimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Scheduled(initialDelay = 1L, fixedDelay = 2L, timeUnit = TimeUnit.SECONDS)
    @Async
    public void foo(){
        System.out.printf("[%s] [%s] ScheduledTaskService#foo()%n", datetimeFormatter.format(LocalDateTime.now()), Thread.currentThread().getName());
    }
}
```



## 实现可动态配置的定时任务

### 实现思路

1. 将任务类（`Runnable`接口实现类）、定时策略（cron表达式）、以及其它配置信息保存到数据库中
2. 自定义`ApplicationRunner`的实现类，在Spring应用启动后，从数据库中加载任务配置信息，进行初始化
3. 定义`ThreadPoolTaskScheduler`线程池任务调度器，在初始化方法中，将任务添加到线程池中
4. 定义管理任务相关接口：创建任务、修改任务、删除任务、查询任务、启动任务、停止任务、重启任务

### 代码实现

#### 准备工作

1.添加依赖

数据库使用H2嵌入式数据库，ORM框架使用JPA

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

2.配置

application.properties

```properties
server.port=8080
spring.application.name=spring-boot-task

# Datasource
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.url=jdbc:h2:mem:test
spring.datasource.username=sa
spring.datasource.password=sa
# sql
spring.sql.init.mode=always
spring.sql.init.platform=h2
spring.sql.init.schema-locations=classpath:db/schema.sql
# spring.sql.init.data-locations=classpath:db/data.sql
# H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.show-sql=true
```

H2控制台访问地址：http://localhost:8080/h2-console

启动类

```java
@SpringBootApplication
@EnableJpaAuditing
public class TaskApp {
    public static void main(String[] args) {
        SpringApplication.run(TaskApp.class, args);
    }
}
```

3.创建数据表

schema.sql

```sql
CREATE TABLE IF NOT EXISTS t_scheduled_task_settings(
    id VARCHAR(32) PRIMARY KEY,
    task_name VARCHAR(100),
    task_class_name VARCHAR(100) UNIQUE,
    task_cron VARCHAR(50),
    status TINYINT CHECK (status IN (0, 1)),
    sort SMALLINT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

4.定义实体类、DAO接口、Service类、Controller类

实体类

```java
@Entity
@Table(name = "t_scheduled_task_settings")
@EntityListeners({AuditingEntityListener.class})
@Data
public class ScheduledTaskSettings {
    @Id
    private String id;

    private String taskName;

    private String taskClassName;

    private String taskCron;

    private Integer status;

    private Integer sort;

    @CreatedDate
    private Date createTime;

    @LastModifiedDate
    private Date updateTime;
}
```

Controller

```java
@RestController
@RequestMapping("/api/task")
public class ScheduledTaskController {

    private final ScheduledTaskService scheduledTaskService;

    @Autowired
    public ScheduledTaskController(ScheduledTaskService scheduledTaskService) {
        this.scheduledTaskService = scheduledTaskService;
    }

    /**
     * 创建任务
     * */
    @PostMapping("/new")
    public ScheduledTaskSettings newTask(@RequestBody ScheduledTaskSettings settings){
        return scheduledTaskService.newTask(settings);
    }

    /**
     * 更新任务
     * */
    @PostMapping("/{id}")
    public ScheduledTaskSettings updateTask(@PathVariable("id") String taskId, @RequestBody ScheduledTaskSettings settings){
        return scheduledTaskService.updateTask(taskId, settings);
    }

    /**
     * 删除任务
     * */
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") String taskId){
        scheduledTaskService.deleteTask(taskId);
    }

    /**
     * 查询任务列表
     * */
    @GetMapping("/list")
    public List<ScheduledTaskSettings> getTaskList(){
        return scheduledTaskService.getTaskList();
    }

    /**
     * 启动任务
     * */
    @PostMapping("/start/{id}")
    public Boolean startTask(@PathVariable("id")String taskId){
        return scheduledTaskService.startTask(taskId);
    }

    /**
     * 停止任务
     * */
    @PostMapping("/stop/{id}")
    public Boolean stop(@PathVariable("id")String taskId){
        return scheduledTaskService.stopTask(taskId);
    }

    /**
     * 重启任务
     * */
    @PostMapping("/restart/{id}")
    public Boolean restartTask(@PathVariable("id")String taskId){
        return scheduledTaskService.restartTask(taskId);
    }
}

```

Service

```java
@Service
public class ScheduledTaskService {
	// 略
}
```

DAO接口

```java
@Repository
public interface ScheduledTaskSettingsRepository extends JpaRepository<ScheduledTaskSettings, String> {

    Optional<ScheduledTaskSettings> findByTaskClassName(String taskClassName);

    Optional<ScheduledTaskSettings> findByIdIsNotAndTaskClassNameEquals(String taskId, String taskClassName);
}
```

工具类

```java
public class IDUtils {

    public static String generateShortUUID(){
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}

@Component
public class SpringUtils implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    public static <T> Set<String> getNullPropertyNames(T bean){
        Set<String> nullPropertyNames = new HashSet<>();

        BeanWrapper beanWrapper = new BeanWrapperImpl(bean);
        PropertyDescriptor[] pds = beanWrapper.getPropertyDescriptors();
        String propertyName;
        for (PropertyDescriptor pd : pds) {
            propertyName = pd.getName();
            if (beanWrapper.getPropertyValue(propertyName) == null){
                nullPropertyNames.add(propertyName);
            }
        }
        return nullPropertyNames;
    }

    public static Object getBean(Class<?> beanClass) {
        return context.getBean(beanClass);
    }

    public static <T> T getBean(String beanName, Class<T> beanClass) {
        return context.getBean(beanName, beanClass);
    }
}
```





#### 自定义`ApplicationRunner`

```java
@Component
public class ScheduledTaskApplicationRunner implements ApplicationRunner {
    private final Logger LOGGER = LoggerFactory.getLogger(ScheduledTaskApplicationRunner.class);

    private final ScheduledTaskService scheduledTaskService;

    public ScheduledTaskApplicationRunner(ScheduledTaskService scheduledTaskService) {
        this.scheduledTaskService = scheduledTaskService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        LOGGER.info("开始初始化定时任务");
        scheduledTaskService.initTask();
        LOGGER.info("定时任务初始化完成");
    }
}
```

#### 自定义`ThreadPoolTaskScheduler`线程池任务调度器

```java
@Configuration
public class ScheduledTaskConfiguration {
    private final Logger LOGGER = LoggerFactory.getLogger(ScheduledTaskConfiguration.class);

    private final int PROCESSOR_COUNT = Runtime.getRuntime().availableProcessors();

    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler(){
        LOGGER.info("开始创建定时任务调度器");

        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(PROCESSOR_COUNT);
        scheduler.setThreadNamePrefix("ScheduledTaskExecutor-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.setContinueExistingPeriodicTasksAfterShutdownPolicy(true);
        scheduler.setExecuteExistingDelayedTasksAfterShutdownPolicy(true);
        scheduler.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        scheduler.initialize();

        LOGGER.info("定时任务调度器创建完成");
        return scheduler;
    }
}
```

#### 定义管理任务相关方法

```java
@Service
public class ScheduledTaskService {
    private final Logger LOGGER = LoggerFactory.getLogger(ScheduledTaskService.class);

    private final ScheduledTaskSettingsRepository taskSettingsRepository;
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final ReentrantLock taskLock;
    private final Map<String, ScheduledFuture<?>> scheduledFutureMap;

    @Autowired
    public ScheduledTaskService(ScheduledTaskSettingsRepository taskSettingsRepository, ThreadPoolTaskScheduler threadPoolTaskScheduler) {
        this.taskSettingsRepository = taskSettingsRepository;
        this.threadPoolTaskScheduler = threadPoolTaskScheduler;
        this.taskLock = new ReentrantLock();
        this.scheduledFutureMap = new ConcurrentHashMap<>();
    }

    public ScheduledTaskSettings newTask(ScheduledTaskSettings taskSettings) {
        String taskClassName = taskSettings.getTaskClassName();
        Integer taskSort = taskSettings.getSort();

        Optional<ScheduledTaskSettings> optionalTaskSettings = taskSettingsRepository.findByTaskClassName(taskClassName);
        if (optionalTaskSettings.isPresent()){
            throw new BusinessException(400, "定时任务类名已存在");
        }

        String taskId = IDUtils.generateShortUUID();
        taskSettings.setId(taskId);
        taskSettings.setStatus(1);
        taskSettings.setSort(taskSort == null ? 0 : taskSort);
        taskSettings = taskSettingsRepository.save(taskSettings);

        // 启动任务
        startTask(taskId);

        return taskSettings;
    }

    public ScheduledTaskSettings updateTask(String taskId, ScheduledTaskSettings taskSettings) {
        String taskClassName = taskSettings.getTaskClassName();
        String taskCron = taskSettings.getTaskCron();

        Optional<ScheduledTaskSettings> optionalTaskSettings = taskSettingsRepository.findById(taskId);
        if (optionalTaskSettings.isEmpty()){
            throw new BusinessException(404, "定时任务不存在");
        }

        Optional<ScheduledTaskSettings> optionalTaskSettings2 = taskSettingsRepository.findByIdIsNotAndTaskClassNameEquals(taskId, taskClassName);
        if (optionalTaskSettings2.isPresent()){
            throw new BusinessException(400, "定时任务类名已存在");
        }

        ScheduledTaskSettings presentTaskSettings = optionalTaskSettings.get();
        Set<String> nullPropertyNames = SpringUtils.getNullPropertyNames(taskSettings);
        BeanUtils.copyProperties(taskSettings, presentTaskSettings, nullPropertyNames.toArray(new String[0]));
        presentTaskSettings = taskSettingsRepository.save(presentTaskSettings);

        // 重启任务
        if (StringUtils.hasLength(taskCron)){
            restartTask(taskId);
        }

        return presentTaskSettings;
    }

    public void deleteTask(String taskId) {
        // 停止任务
        Boolean stopSuccess = stopTask(taskId);
        if (stopSuccess){
            // 删除任务
            taskSettingsRepository.deleteById(taskId);
        }
    }

    public List<ScheduledTaskSettings> getTaskList() {
        Sort sort = Sort.by(Sort.Direction.ASC, "sort");
        return taskSettingsRepository.findAll(sort);
    }

    public void initTask(){
        Sort sort = Sort.by(Sort.Direction.ASC, "sort");
        List<ScheduledTaskSettings> taskSettingsList = taskSettingsRepository.findAll(sort);
        if (CollectionUtils.isEmpty(taskSettingsList)){
            return;
        }

        for (ScheduledTaskSettings taskSettings : taskSettingsList) {
            if (taskSettings.getStatus() != 1){
                continue;
            }
            doStartTask(taskSettings);
        }
    }

    public Boolean startTask(String taskId) {
        Optional<ScheduledTaskSettings> optionalTaskSettings = taskSettingsRepository.findById(taskId);
        if (optionalTaskSettings.isEmpty()){
            LOGGER.error("任务不存在");
            return false;
        }

        ScheduledTaskSettings taskSettings = optionalTaskSettings.get();
        String taskName = taskSettings.getTaskName();

        taskLock.lock();
        try {
            if (taskSettings.getStatus() != 1) {
                LOGGER.error("[{}] 任务已被禁用, 启动失败", taskName);
                return false;
            }
            if (isTaskRunning(taskId)){
                LOGGER.info("[{}] 任务运行中, 无须重复启动", taskName);
                return false;
            }
            return doStartTask(taskSettings);
        }finally {
            taskLock.unlock();
        }
    }

    private boolean doStartTask(ScheduledTaskSettings taskSettings) {
        String taskId = taskSettings.getId();
        String taskName = taskSettings.getTaskName();
        String taskClassName = taskSettings.getTaskClassName();
        String taskCron = taskSettings.getTaskCron();

        LOGGER.info("[{}] 开始启动", taskName);

        try {
            Class<?> taskClz = Class.forName(taskClassName);
            if (Runnable.class.isAssignableFrom(taskClz)) {
                Runnable task = (Runnable) SpringUtils.getBean(taskClz);
                ScheduledFuture<?> scheduledFuture = threadPoolTaskScheduler.schedule(task,
                        (TriggerContext context) -> new CronTrigger(taskCron, TimeZone.getDefault()).nextExecutionTime(context));
                scheduledFutureMap.put(taskId, scheduledFuture);
                LOGGER.info("[{}] 启动成功", taskName);
                return true;
            }
        } catch (ClassNotFoundException e) {
            // throw new RuntimeException(e);
        }
        LOGGER.error("[{}] Java类[{}]不存在, 启动失败", taskClassName, taskName);
        return false;
    }

    public Boolean stopTask(String taskId) {
        Optional<ScheduledTaskSettings> optionalTaskSettings = taskSettingsRepository.findById(taskId);
        if (optionalTaskSettings.isEmpty()){
            LOGGER.error("任务不存在");
            return false;
        }

        ScheduledTaskSettings taskSettings = optionalTaskSettings.get();
        return this.doStopTask(taskSettings);
    }

    private boolean doStopTask(ScheduledTaskSettings taskSettings){
        String taskId = taskSettings.getId();
        String taskName = taskSettings.getTaskName();

        LOGGER.info("[{}] 开始停止", taskName);

        ScheduledFuture<?> scheduledFuture = scheduledFutureMap.get(taskId);
        if (scheduledFuture == null || scheduledFuture.isCancelled()){
            LOGGER.info("[{}]: 未运行", taskName);
            return true;
        }

        scheduledFuture.cancel(true);
        scheduledFutureMap.remove(taskId);
        LOGGER.info("[{}] 停止成功", taskName);
        return true;
    }

    public Boolean restartTask(String taskId) {
        Optional<ScheduledTaskSettings> optionalTaskSettings = taskSettingsRepository.findById(taskId);
        if (optionalTaskSettings.isEmpty()){
            LOGGER.error("定时任务不存在");
            return false;
        }

        ScheduledTaskSettings taskSettings = optionalTaskSettings.get();
        return this.doRestartTask(taskSettings);
    }

    private Boolean doRestartTask(ScheduledTaskSettings taskSettings){
        String taskId = taskSettings.getId();
        String taskName = taskSettings.getTaskName();

        LOGGER.info("[{}] 开始重启...", taskName);

        Boolean stopSuccess = this.stopTask(taskId);
        if (stopSuccess){
            return this.startTask(taskId);
        }
        return false;
    }

    private boolean isTaskRunning(String taskClassName){
        ScheduledFuture<?> scheduledFuture = scheduledFutureMap.get(taskClassName);
        return scheduledFuture != null && !scheduledFuture.isCancelled();
    }
}
```

#### 定义测试任务

```java
@Component
public class TestTask1 implements Runnable{
    @Override
    public void run() {
        System.out.println("di...");
    }
}

@Component
public class TestTask2 implements Runnable{
    @Override
    public void run() {
        System.out.println("da...");
    }
}
```

### 测试HTTP脚本

```
### 新增任务1
POST http://localhost:8080/api/task/new
Content-Type: application/json

{
  "taskName": "测试任务1",
  "taskClassName": "me.lyp.task.dynamic.task.TestTask1",
  "taskCron": "0/5 * * * * ?"
}


### 新增任务2
POST http://localhost:8080/api/task/new
Content-Type: application/json

{
  "taskName": "测试任务2",
  "taskClassName": "me.lyp.task.dynamic.task.TestTask2",
  "taskCron": "0/3 * * * * ?"
}


### 更新任务
POST http://localhost:8080/api/task/58220251ad104c90bf95f4e977a4cbf3
Content-Type: application/json

{
  "taskName": "测试任务2",
  "taskClassName": "me.lyp.task.dynamic.task.TestTask2",
  "taskCron": "0/2 * * * * ?",
  "status": 0,
  "sort": 1
}


### 删除任务
DELETE http://localhost:8080/api/task/70b2e8d8cb2941ab8d019d974ae81695


### 查询任务列表
GET http://localhost:8080/api/task/list


### 启动任务
POST http://localhost:8080/api/task/start/58220251ad104c90bf95f4e977a4cbf3


### 停止任务
POST http://localhost:8080/api/task/stop/58220251ad104c90bf95f4e977a4cbf3


### 重启任务
POST http://localhost:8080/api/task/restart/58220251ad104c90bf95f4e977a4cbf3
```

