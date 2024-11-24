---
title: SpringBoot文件上传与下载
createTime: 2024/11/24 15:56:15
permalink: /notes/java/ljdovmoz/
---
配置单文件大小（默认1MB）和单次请求允许的文件大小（默认10MB）

```properties
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=2MB
spring.servlet.multipart.max-request-size=10MB
```

定义上传、下载接口

```java
@Getter
@Setter
@AllArgsConstructor
public class FileVO {
    private String url;
}

@RestController
@RequestMapping("/files")
public class FileController {
    private final IFileService fileService;

    public FileController(IFileService fileService) {
        this.fileService = fileService;
    }

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    public ApiResult<FileVO> upload(@RequestPart("code") String code, @RequestPart("file") MultipartFile file) {
        return fileService.upload(code, file);
    }

    /**
     * 下载文件
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam("code") String code, @RequestParam("filename") String filename) {
        return fileService.download(code, filename);
    }
}
```

实现Service

```java
@Service
public class FileServiceImpl implements IFileService {

    /**
     * 图片存储文件夹路径
     */
    @Value("${custom.files.book.cover-dir}") private String bookCoverImageDir;

    private static final Set<String> SUPPORT_IMAGE_FORMAT_SET = Set.of("jpg", "jpeg", "png");

    @Override
    public ApiResult<FileVO> upload(String code, MultipartFile file) {
        switch(code) {
            case "BOOK_COVER": // 上传图书封面图片
                String filename = uploadBookCoverImage(file, bookCoverImageDir);
                String url = buildDownloadUrl(code, filename);
                return ApiResult.success(new FileVO(url));
            default:
                throw new BusinessException(BAD_REQUEST.code(), "不支持的文件业务编码");
        }
    }

    @Override
    public ResponseEntity<Resource> download(String code, String filename) {
        switch(code) {
            case "BOOK_COVER": // 下载图书封面图片
                Path filepath = Paths.get(bookCoverImageDir, filename);
                try {
                    Resource resource = new UrlResource(filepath.toUri());
                    if(resource.exists() && resource.isReadable()) {
                        return ResponseEntity.ok()
                                             .header(HttpHeaders.CONTENT_TYPE, "application/forc-download")
                                             .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"", filename))
                                             .body(resource);
                    } else {
                        throw new BusinessException(BAD_REQUEST.code(), "文件不存在");
                    }
                } catch(IOException e) {
                    throw new BusinessException(SERVER_ERROR.code(), "服务器出错");
                }
            default:
                throw new BusinessException(BAD_REQUEST.code(), "不支持的文件业务编码");

        }
    }

    /**
     * 上传图书封面图片
     */
    private String uploadBookCoverImage(MultipartFile file, String dir) {
        try {
            // 校验文件大小
            long fileSize = file.getSize();
            if(fileSize / 1024 / 1024 > 2) {
                throw new BusinessException(BAD_REQUEST.code(), "图片文件大小限制2MB");
            }
            // 校验图片格式
            String originalFilename = file.getOriginalFilename();
            String fileSuffix = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
            if(!SUPPORT_IMAGE_FORMAT_SET.contains(fileSuffix.toLowerCase())) {
                throw new BusinessException(BAD_REQUEST.code(), "图片格式不支持");
            }

            String filename = String.format("%s.%s", filename(), fileSuffix);
            file.transferTo(new File(dir, filename));
            return filename;
        } catch(IOException e) {
            throw new BusinessException(BAD_REQUEST.code(), "图片上传失败");
        }
    }

    /**
     * 拼接下载URL
     */
    private String buildDownloadUrl(String code, String filename) {
        return String.format("/files/download?code=%s&filename=%s", code, filename);
    }
}
```

