---
title: Apache POI处理Excel文件
createTime: 2024/11/30 15:13:48
permalink: /notes/java/swwvsu6t/
---
Apache POI处理Excel文件有以下几种API：

- HSSF：支持处理Excel 97至2003的文件(.xls)
- XSSF：支持处理Excel 2007之后的OOXML的文件(.xlsx)
- SXSSF：POI3.8版本新增，基于XSSF，提供低内存占用的API，适用于处理大数据量的Excel文件

## 读取Excel文件

```java
File file = new File("E:\\files\\员工信息登记表.xlsx");
// 1.创建工作簿
try (XSSFWorkbook workbook = new XSSFWorkbook(file);) {
    // 2.获取工作表
    XSSFSheet sheet = workbook.getSheetAt(0);
    // 3.遍历行
    for (Row row : sheet) {
        // 4.遍历单元格,读取单元格内容
        for (Cell cell : row) {
            // 获取单元格内容类型, 使用相应的API获取单元格值(日期类型会被解析为NUMERIC, 需要做额外判断)
            CellType cellType = cell.getCellType();
            switch (cellType) {
                case NUMERIC -> {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        String dateStr = new SimpleDateFormat("yyyy/MM/dd").format(date);
                        System.out.printf("%s\t", dateStr);
                    } else {
                        System.out.printf("%s\t", cell.getNumericCellValue());
                    }
                }
                case STRING -> System.out.printf("%s\t", cell.getStringCellValue());
                case BOOLEAN -> System.out.printf("%s\t", cell.getBooleanCellValue());
            }

        }
        System.out.println();
    }
} catch (IOException | InvalidFormatException e) {
    throw new RuntimeException(e);
}
```

## 写入Excel文件

```java
File file = new File("E:\\files\\员工信息登记表2.xlsx");
String[][] data = {
        {"序号", "姓名", "部门", "岗位", "性别", "民族", "身份证号码", "出生日期", "年龄", "地址", "学历", "入职日期", "试用期", "联系电话", "备注"},
        {"1", "张三", "人力资源部", "招聘专员", "男", "汉", "123456199001012000", "1990/1/1", "33", "北京市朝阳区", "本科", "2015/7/1", "3个月", "13800138000", "无"},
        {"2", "李四", "财务部", "会计", "女", "汉", "654321199205156000", "1992/5/15", "31", "上海市黄浦区", "硕士", "2017/3/15", "6个月", "13900139000", "已婚"},
        {"3", "王五", "市场部", "市场专员", "男", "汉", "234567198810203000", "1988/10/20", "34", "广州市天河区", "本科", "2013/9/1", "3个月", "13700137000", "有车"}
};

SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
XSSFCellStyle dateCellStyle;

// 1.创建工作簿
try (XSSFWorkbook workbook = new XSSFWorkbook();
     FileOutputStream out = new FileOutputStream(file)) {
    // 定义日期类型单元格Style
    dateCellStyle = workbook.createCellStyle();
    XSSFCreationHelper creationHelper = workbook.getCreationHelper();
    short dateCellFormatIndex = creationHelper.createDataFormat().getFormat("yyyy/MM/dd");
    dateCellStyle.setDataFormat(dateCellFormatIndex);

    // 2.创建工作表
    XSSFSheet sheet = workbook.createSheet();

    for (int rowIndex = 0; rowIndex < data.length; rowIndex++) {
        String[] rowData = data[rowIndex];
        // 3.创建行
        XSSFRow row = sheet.createRow(rowIndex);
        for (int colIndex = 0; colIndex < rowData.length; colIndex++) {
            String value = rowData[colIndex];
            XSSFCell cell = row.createCell(colIndex);
            // 4.创建单元格, 并设置单元格内容
            if (rowIndex == 0) {
                // 表头行
                cell.setCellValue(value);
                continue;
            }
            switch (colIndex) {
                case 0: // 序号
                case 8: // 年龄
                    cell.setCellType(CellType.NUMERIC);
                    cell.setCellValue(Integer.parseInt(value));
                    break;
                case 7: // 出生日期
                case 11: // 入职日期
                    cell.setCellType(CellType.NUMERIC);
                    cell.setCellStyle(dateCellStyle);
                    cell.setCellValue(dateFormat.parse(value));
                    break;
                default:
                    cell.setCellType(CellType.STRING);
                    cell.setCellValue(value);
            }
        }
    }
    // 5.写入文件
    workbook.write(out);
} catch (IOException | ParseException e) {
    throw new RuntimeException(e);
}
```

## 合并单元格



## 单元格样式

对齐、字体、颜色、边框、填充

数据格式
