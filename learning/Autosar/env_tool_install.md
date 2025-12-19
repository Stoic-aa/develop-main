# 一、安装 EB tresos 

1. NXP 官网的设计中学的软件库中搜索这个即可：```AUTOSAR 4.3 MCAL (QM) for S32K118 and S32K14x - Crypto Driver included ```, 然后有 EB tresos 和 MACL相关的包

2. 可以参考这个连接 [EB Tresos激活码获取方式](https://blog.csdn.net/LLLJW_/article/details/145495332)

3. 然后下载下面三个中的后面两个：

- Automotive SW - AUTOSAR MCAL / ISO 26262
- Automotive SW - AUTOSAR MCAL / QM
- Automotive SW - EB tresos Studio / AUTOSAR Configuration Tool
4. 如果 许可证不起效果的话，可以尝试使用下面这个：```9157-2EF4-ADA2-D9C2```



# 二、装 MACL_V4.2

1. 进入 ```Automotive SW - AUTOSAR MCAL / QM``` 这个下载界面，把密钥给保存成 txt 到桌面，同时打开软件然后一一直下一步即可，让填密钥就加载刚才的内容，然后 EB tresos 路径就选择刚才安装的路径，记得找到 **tresos的路径，不是软件的安装路径**



# 三、安装 IAR 编译安装软件

1. 版本是 IAR_v8.40.2
2. 用注册机进行激活，这个不用多赘述了
3. 严格按照激活步骤即可


# 四、安装 DaVinci 达芬奇相关

1. 安装版本为 ：```DaVinci_Developer_4.6.20.exe```
2. 先装驱动：```DaVinci_ExternalComponentsSetup_2_14_0_0.exe```
3. 再装软件```DaVinci_Developer_4.6.20.exe```，注意装驱动的时候有一个 老系统的组件 NET3.5 需要安装，这个最简单的安装方法就是让自己的电脑开启自动更新的，有一个软件能自动一键开启电脑自动更新和禁止更新，工具名称为：```Winddows Update Blocker``` 比较好用，装完直接删除即可


# 五、安装 S32K144 SIP包

1. ```D:\Autosar\AUTOSAR_TOOLs\S32K144_SIP\MICROSAR\CBD1800257_D01_S32K1xx```
2. 进入下面的目录：前面的系统目录之类的不用管，每个人 不一样，看后面的目录即可```D:\Autosar\AUTOSAR_TOOLs\S32K144_SIP\MICROSAR\CBD1800257_D01_S32K1xx\ThirdParty\McalIntegrationHelper```
4. 然后选第四行，默认的就是，然后配置 刚才安装的 EB tresos 和 MCAL路径，然后点击确定, 看附件文档保姆大全

5. 咸鱼启动加密够，DaVinci Develop 和 Davinci Config 需要加密狗才能启动


# 五、安装 S32K144 SIP包

# 三、常见错误

1. 激活失败，ERROR: flxActAppActivationSend (50040,41147,10248)
The quantity specified exceeds maximum quantity allowed (0).
Connection to FlexNet Operations Server failed.
2. 这个是因为lescience 失效了，等官方更新