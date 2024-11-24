---
title: Java处理XML数据
createTime: 2024/11/24 15:56:15
permalink: /notes/java/cbyug1cd/
---
示例数据: *bookstore.xml*

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book category="fiction">
        <title>Harry Potter</title>
        <author>J.K. Rowling</author>
        <year>2005</year>
        <price>29.99</price>
    </book>
    <book category="children">
        <title>The Lion, the Witch and the Wardrobe</title>
        <author>C.S. Lewis</author>
        <year>2001</year>
        <price>19.99</price>
    </book>
    <book category="fiction">
        <title>To Kill a Mockingbird</title>
        <author>Harper Lee</author>
        <year>1960</year>
        <price>24.99</price>
    </book>
</bookstore>
```

## DOM解析

DOM(Document Object Model), 文档对象模型, 是一种树型解析器, 将读入的XML文档解析为数结构.

```hava
try {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    Document doc = builder.parse("bookstore.xml");

    Element root = doc.getDocumentElement();
    // ...
} catch(ParserConfigurationException | IOException | SAXException e) {
    e.printStackTrace();
}
```



## SAX解析

SAX(Simple API for XML), XML简单API, 是一种流型解析器, 在读入XML文档的过程中, 生成相应的事件.

```java
public static void main(String[] args) {
    SAXParserFactory factory = SAXParserFactory.newInstance();
    try {
        SAXParser parser = factory.newSAXParser();
        parser.parse(new File("bookstore.xml"), new MyHandler());
    } catch(ParserConfigurationException | SAXException | IOException e) {
        e.printStackTrace();
    }
}

private static class MyHandler extends DefaultHandler{
    @Override
    public void startDocument() throws SAXException {
        System.out.println("开始解析XML");
    }

    @Override
    public void endDocument() throws SAXException {
        System.out.println("结束解析XML");
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        System.out.printf("<%s", qName);
        int length = attributes.getLength();
        for(int i = 0; i < length; i++) {
            String attrQName = attributes.getQName(i);
            String attrValue = attributes.getValue(attrQName);
            System.out.printf(" %s=\"%s\"", attrQName, attrValue);
            if(i != length - 1){
                System.out.print(",");
            }
        }

        System.out.print(">");
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        System.out.printf("</%s>%n", qName);
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        String text = new String(ch, start, length);
        System.out.printf("%s", text);
    }
}
```

