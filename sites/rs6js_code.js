xuxuprocess=process;
const xuxuv8 = require('v8');
const xuxuvm=require('vm');
xuxuv8.setFlagsFromString('--allow-natives-syntax');
let undetectable = xuxuvm.runInThisContext("%GetUndetectable()");
xuxuv8.setFlagsFromString('--no-allow-natives-syntax');
const deasync = require('deasync');
const { Worker: ThreadWorker } = require("worker_threads");

content = 'Da03SN5KdoDGEOOOJO6iLzFNEx2wxaF5-AVN9_Ty_7O389s5CKEbZg3J5ikqMwzWtZ2l1H23-s0';

span_style={"mmllii":{"width":1327,"height":150},"SimHei":{"width":912,"height":114},"SimSun":{"width":912,"height":114},"NSimSun":{"width":912,"height":114},"FangSong":{"width":912,"height":114},"KaiTi":{"width":912,"height":114},"FangSongGB2312":{"width":1327,"height":150},"KaiTiGB2312":{"width":1327,"height":150},"Microsoft YaHei":{"width":1327,"height":150},"Hiragino Sans GB":{"width":1327,"height":150},"STHeiti Light":{"width":1327,"height":150},"STHeiti":{"width":1327,"height":150},"STKaiti":{"width":1097,"height":128},"STSong":{"width":1097,"height":128},"STFangsong":{"width":1097,"height":128},"LiSu":{"width":912,"height":114},"YouYuan":{"width":912,"height":114},"STXihei":{"width":1290,"height":123},"STZhongsong":{"width":1350,"height":130},"FZShuTi":{"width":1160,"height":120},"FZYaoti":{"width":1099,"height":129},"STCaiyun":{"width":1137,"height":118},"STHupo":{"width":1137,"height":118},"STLiti":{"width":914,"height":115},"STXingkai":{"width":823,"height":119},"STXinwei":{"width":1212,"height":116},"DFPhelvetica":{"width":1327,"height":150},"Tibetan Machine Uni":{"width":1327,"height":150},"Cooljazz":{"width":1327,"height":150},"Verdana":{"width":1376,"height":138},"Helvetica Neue LT Pro 35 Thin":{"width":1238,"height":137},"tahoma":{"width":1184,"height":138},"LG Smart_H test Regular":{"width":1327,"height":150},"DINPro-light":{"width":1327,"height":150},"Helvetica LT 43 Light Extended":{"width":1238,"height":137},"HelveM_India":{"width":1327,"height":150},"SECRobotoLight Bold":{"width":1327,"height":150},"OR Mohanty Unicode Regular":{"width":1327,"height":150},"Droid Sans Thai":{"width":1327,"height":150},"Kannada Sangam MN":{"width":1327,"height":150},"DDC Uchen":{"width":1327,"height":150},"clock2016_v1.1":{"width":1238,"height":137},"SamsungKannadaRegular":{"width":1327,"height":150},"MI LANTING Bold":{"width":1327,"height":150},"SamsungSansNum3L Light":{"width":1327,"height":150},"verdana":{"width":1376,"height":138},"HelveticaNeueThin":{"width":1327,"height":150},"SECFallback":{"width":1327,"height":150},"SamsungEmoji":{"width":1327,"height":150},"Telugu Sangam MN":{"width":1327,"height":150},"Carrois Gothic SC":{"width":1327,"height":150},"Flyme Light Roboto Light":{"width":1327,"height":150},"SoMA-Digit Light":{"width":1327,"height":150},"SoMC Sans Regular":{"width":1327,"height":150},"HYXiYuanJ":{"width":1327,"height":150},"sst":{"width":1327,"height":150},"samsung-sans-num4T":{"width":1327,"height":150},"gm_mengmeng":{"width":1327,"height":150},"Lohit Kannada":{"width":1327,"height":150},"times new roman":{"width":1134,"height":126},"samsung-sans-num4L":{"width":1327,"height":150},"serif-monospace":{"width":1327,"height":150},"SamsungSansNum-3T Thin":{"width":1327,"height":150},"ColorOSUI-XThin":{"width":1327,"height":150},"Droid Naskh Shift Alt":{"width":1327,"height":150},"SamsungTeluguRegular":{"width":1327,"height":150},"Bengali OTS":{"width":1327,"height":150},"MI LanTing_GB Outside YS":{"width":1327,"height":150},"FZMiaoWu_GB18030":{"width":1327,"height":150},"helve-neue-regular":{"width":1327,"height":150},"SST Medium":{"width":1327,"height":150},"Courier New":{"width":1095,"height":130},"Khmer Mondulkiri Bold":{"width":1327,"height":150},"Helvetica LT 23 Ultra Light Extended":{"width":1238,"height":137},"Helvetica LT 25 Ultra Light":{"width":1238,"height":137},"Roboto Medium":{"width":1327,"height":150},"Droid Sans Bold":{"width":1327,"height":150},"goudy":{"width":1327,"height":150},"sans-serif-condensed-light":{"width":1327,"height":150},"SFinder":{"width":1327,"height":150},"noto-sans-cjk-medium":{"width":1327,"height":150},"miui":{"width":1327,"height":150},"MRocky PRC Bold":{"width":1327,"height":150},"AndroidClock Regular":{"width":1327,"height":150},"SamsungSansNum-4L Light":{"width":1327,"height":150},"sans-serif-thin":{"width":1327,"height":150},"AaPangYaer":{"width":1327,"height":150},"casual":{"width":1327,"height":150},"BN MohantyOT Bold":{"width":1327,"height":150},"x-sst":{"width":1327,"height":150},"NotoSansMyanmarZawgyi":{"width":1327,"height":150},"Helvetica LT 33 Thin Extended":{"width":1238,"height":137},"AshleyScriptMT Alt":{"width":1327,"height":150},"Noto Sans Devanagari UI":{"width":1327,"height":150},"Roboto Condensed Bold":{"width":1327,"height":150},"Roboto Medium Italic":{"width":1327,"height":150},"miuiex":{"width":1327,"height":150},"Noto Sans Gurmukhi UI":{"width":1327,"height":150},"SST Vietnamese Light":{"width":1327,"height":150},"LG_Oriya":{"width":1327,"height":150},"hycoffee":{"width":1327,"height":150},"x-sst-ultralight":{"width":1327,"height":150},"DFHeiAW7-A":{"width":1327,"height":150},"FZZWXBTOT_Unicode":{"width":1327,"height":150},"Devanagari Sangam MN Bold":{"width":1327,"height":150},"sans-serif-monospace":{"width":1327,"height":150},"Padauk Book Bold":{"width":1327,"height":150},"LG-FZYingBiKaiShu-S15-V2.2":{"width":1238,"height":137},"LG-FZYingBiKaiShu-S15-V2.3":{"width":1238,"height":137},"HelveticaNeueLT Pro 35 Th":{"width":1238,"height":137},"Microsoft Himalaya":{"width":759,"height":114},"SamsungSansFallback":{"width":1327,"height":150},"SST Medium Italic":{"width":1327,"height":150},"AndroidEmoji":{"width":1327,"height":150},"SamsungSansNum-3R":{"width":1327,"height":150},"ITC Stone Serif":{"width":1327,"height":150},"sans-serif-smallcaps":{"width":1327,"height":150},"x-sst-medium":{"width":1327,"height":150},"LG_Sinhalese":{"width":1327,"height":150},"Roboto Thin Italic":{"width":1327,"height":150},"century-gothic":{"width":1327,"height":150},"Clockopia":{"width":1327,"height":150},"Luminous_Sans":{"width":1327,"height":150},"Floridian Script Alt":{"width":1327,"height":150},"Noto Sans Gurmukhi Bold":{"width":1327,"height":150},"LTHYSZK Bold":{"width":1327,"height":150},"GS_Thai":{"width":1327,"height":150},"SamsungNeoNum_3T_2":{"width":1327,"height":150},"Arabic":{"width":1327,"height":150},"hans-sans-normal":{"width":1327,"height":150},"Lohit Telugu":{"width":1327,"height":150},"HYQiHei-50S Light":{"width":1327,"height":150},"Lindsey for Samsung":{"width":1327,"height":150},"AR Crystalhei DB":{"width":1327,"height":150},"Samsung Sans Medium":{"width":1327,"height":150},"samsung-sans-num45":{"width":1327,"height":150},"hans-sans-bold":{"width":1327,"height":150},"Luminous_Script":{"width":1327,"height":150},"SST Condensed":{"width":1327,"height":150},"SamsungDevanagariRegular":{"width":1327,"height":150},"Anjal Malayalam MN":{"width":1327,"height":150},"SamsungThai(test)":{"width":1238,"height":137},"FZLanTingHei-M-GB18030":{"width":1327,"height":150},"Hebrew OTS":{"width":1327,"height":150},"GS45_Arab(AndroidOS)":{"width":1238,"height":137},"Samsung Sans Light":{"width":1327,"height":150},"Choco cooky":{"width":1327,"height":150},"helve-neue-thin":{"width":1327,"height":150},"PN MohantyOT Medium":{"width":1327,"height":150},"LG-FZKaTong-M19-V2.4":{"width":1238,"height":137},"Droid Serif":{"width":1327,"height":150},"SamsungSinhalaRegular":{"width":1327,"height":150},"helvetica":{"width":1171,"height":127},"LG-FZKaTong-M19-V2.2":{"width":1238,"height":137},"Noto Sans Devanagari UI Bold":{"width":1327,"height":150},"SST Light":{"width":1327,"height":150},"DFPEmoji":{"width":1327,"height":150},"weatherfontnew Regular":{"width":1327,"height":150},"RobotoNum3R":{"width":1327,"height":150},"DINPro-medium":{"width":1327,"height":150},"Samsung Sans Num55":{"width":1327,"height":150},"SST Heavy Italic":{"width":1327,"height":150},"LGlock4 Regular_0805":{"width":1327,"height":150},"Georgia":{"width":1270,"height":130},"noto-sans-cjk":{"width":1327,"height":150},"Telugu Sangam MN Bold":{"width":1327,"height":150},"MIUI EX Normal":{"width":1327,"height":150},"HYQiHei-75S Bold":{"width":1327,"height":150},"NotoSansMyanmarZawgyi Bold":{"width":1327,"height":150},"yunospro-black":{"width":1327,"height":150},"helve-neue-normal":{"width":1327,"height":150},"Luminous_Serif":{"width":1327,"height":150},"TM MohantyOT Normal":{"width":1327,"height":150},"SamsungSansNum-3Lv Light":{"width":1327,"height":150},"Samsung Sans Num45":{"width":1327,"height":150},"SmartGothic Medium":{"width":1327,"height":150},"georgia":{"width":1270,"height":130},"casual-font-type":{"width":1327,"height":150},"Samsung Sans Bold":{"width":1327,"height":150},"small-capitals":{"width":1327,"height":150},"MFinance PRC Bold":{"width":1327,"height":150},"FZLanTingHei_GB18030":{"width":1327,"height":150},"SamsungArmenian":{"width":1327,"height":150},"Roboto Bold":{"width":1327,"height":150},"century-gothic-bold":{"width":1327,"height":150},"x-sst-heavy":{"width":1327,"height":150},"SST Light Italic":{"width":1327,"height":150},"TharLon":{"width":1327,"height":150},"x-sst-light":{"width":1327,"height":150},"Dinbol Regular":{"width":1327,"height":150},"SamsungBengaliRegular":{"width":1327,"height":150},"KN MohantyOTSmall Medium":{"width":1327,"height":150},"hypure":{"width":1327,"height":150},"SamsungTamilRegular":{"width":1327,"height":150},"Malayalam Sangam MN":{"width":1327,"height":150},"Noto Sans Kannada UI":{"width":1327,"height":150},"helve-neue":{"width":1327,"height":150},"Helvetica LT 55 Roman":{"width":1238,"height":137},"Noto Sans Kannada Bold":{"width":1327,"height":150},"Sanpya":{"width":1327,"height":150},"SamsungPunjabiRegular":{"width":1327,"height":150},"samsung-sans-num4Lv":{"width":1327,"height":150},"LG_Kannada":{"width":1327,"height":150},"Samsung Sans Regular":{"width":1327,"height":150},"Zawgyi-One":{"width":1327,"height":150},"Droid Serif Bold Italic":{"width":1327,"height":150},"FZKATJW":{"width":1327,"height":150},"courier new":{"width":1095,"height":130},"SamsungEmojiRegular":{"width":1327,"height":150},"MIUI EX Bold":{"width":1327,"height":150},"Android Emoji":{"width":1327,"height":150},"Noto Naskh Arabic UI":{"width":1327,"height":150},"LCD Com":{"width":1327,"height":150},"Futura Medium BT":{"width":1327,"height":150},"Vivo-extract":{"width":1327,"height":150},"Bangla Sangam MN Bold":{"width":1327,"height":150},"hans-sans-regular":{"width":1327,"height":150},"SNum-3R":{"width":1327,"height":150},"SNum-3T":{"width":1327,"height":150},"hans-sans":{"width":1327,"height":150},"SST Ultra Light":{"width":1327,"height":150},"Roboto Regular":{"width":1327,"height":150},"Roboto Light":{"width":1327,"height":150},"Hanuman":{"width":1327,"height":150},"newlggothic":{"width":1327,"height":150},"DFHeiAW5-A":{"width":1327,"height":150},"hans-sans-light":{"width":1327,"height":150},"Plate Gothic":{"width":1327,"height":150},"SNum-3L":{"width":1327,"height":150},"Helvetica LT 45 Light":{"width":1238,"height":137},"Myanmar Sangam Zawgyi Bold":{"width":1327,"height":150},"lg-sans-serif-light":{"width":1327,"height":150},"MIUI EX Light":{"width":1327,"height":150},"Roboto Thin":{"width":1327,"height":150},"SoMA Bold":{"width":1327,"height":150},"Padauk":{"width":1327,"height":150},"Samsung Sans":{"width":1327,"height":150},"Spacious_SmallCap":{"width":1327,"height":150},"sans-serif":{"width":1327,"height":150},"DV MohantyOT Medium":{"width":1327,"height":150},"Stable_Slap":{"width":1327,"height":150},"monaco":{"width":1327,"height":150},"Flyme-Light":{"width":1327,"height":150},"fzzys-dospy":{"width":1327,"height":150},"ScreenSans":{"width":1327,"height":150},"clock2016":{"width":1327,"height":150},"Roboto Condensed Bold Italic":{"width":1327,"height":150},"Arial":{"width":1171,"height":127},"KN Mohanty Medium":{"width":1327,"height":150},"MotoyaLMaru W3 mono":{"width":1327,"height":150},"Handset Condensed":{"width":1327,"height":150},"Roboto Italic":{"width":1327,"height":150},"HTC Hand":{"width":1327,"height":150},"SST Ultra Light Italic":{"width":1327,"height":150},"SST Vietnamese Roman":{"width":1327,"height":150},"Noto Naskh Arabic UI Bold":{"width":1327,"height":150},"chnfzxh-medium":{"width":1327,"height":150},"SNumCond-3T":{"width":1327,"height":150},"century-gothic-regular":{"width":1327,"height":150},"default_roboto-light":{"width":1327,"height":150},"Noto Sans Myanmar":{"width":1327,"height":150},"Myanmar Sangam MN":{"width":1327,"height":150},"Apple Color Emoji":{"width":1327,"height":150},"weatherfontReg":{"width":1327,"height":150},"SamsungMalayalamRegular":{"width":1327,"height":150},"arial":{"width":1171,"height":127},"Droid Serif Bold":{"width":1327,"height":150},"CPo3 PRC Bold":{"width":1327,"height":150},"MI LANTING":{"width":1327,"height":150},"SamsungKorean-Regular":{"width":1327,"height":150},"test45 Regular":{"width":1327,"height":150},"spirit_time":{"width":1327,"height":150},"Devanagari Sangam MN":{"width":1327,"height":150},"ScreenSerif":{"width":1327,"height":150},"Roboto":{"width":1238,"height":137},"cursive-font-type":{"width":1327,"height":150},"STHeiti_vivo":{"width":1327,"height":150},"chnfzxh":{"width":1327,"height":150},"Samsung ClockFont 3A":{"width":1238,"height":137},"Roboto Condensed Regular":{"width":1327,"height":150},"samsung-neo-num3R":{"width":1327,"height":150},"GJ MohantyOT Medium":{"width":1327,"height":150},"Chulho Neue Lock":{"width":1327,"height":150},"roboto-num3L":{"width":1327,"height":150},"helve-neue-ultraLightextended":{"width":1327,"height":150},"SamsungOriyaRegular":{"width":1327,"height":150},"SamsungSansNum-4Lv Light":{"width":1327,"height":150},"MYingHei_18030_C2-Bold":{"width":1327,"height":150},"DFPShaoNvW5-GB":{"width":1327,"height":150},"Roboto Black":{"width":1327,"height":150},"helve-neue-ultralight":{"width":1327,"height":150},"gm_xihei":{"width":1327,"height":150},"LGlock4 Light_0805":{"width":1327,"height":150},"Gujarati Sangam MN":{"width":1327,"height":150},"Malayalam Sangam MN Bold":{"width":1327,"height":150},"roboto-num3R":{"width":1327,"height":150},"STXihei_vivo":{"width":1327,"height":150},"FZZhunYuan_GB18030":{"width":1327,"height":150},"noto-sans-cjk-light":{"width":1327,"height":150},"coloros":{"width":1327,"height":150},"Noto Sans Gurmukhi":{"width":1327,"height":150},"Noto Sans Symbols":{"width":1327,"height":150},"Roboto Light Italic":{"width":1327,"height":150},"Lohit Tamil":{"width":1327,"height":150},"cursive":{"width":912,"height":114},"default_roboto":{"width":1327,"height":150},"BhashitaComplexSans Bold":{"width":1327,"height":150},"LG_Number_Roboto Thin":{"width":1327,"height":150},"monospaced-without-serifs":{"width":1327,"height":150},"Helvetica LT 35 Thin":{"width":1238,"height":137},"samsung-sans-num3LV":{"width":1327,"height":150},"DINPro":{"width":1327,"height":150},"Jomolhari":{"width":1327,"height":150},"sans-serif-light":{"width":1327,"height":150},"helve-neue-black":{"width":1327,"height":150},"Lohit Bengali":{"width":1327,"height":150},"Myanmar Sangam Zawgyi":{"width":1327,"height":150},"Droid Serif Italic":{"width":1327,"height":150},"Roboto Bold Italic":{"width":1327,"height":150},"NanumGothic":{"width":1327,"height":150},"Sony Mobile UD Gothic Regular":{"width":1327,"height":150},"Georgia Bold Italic":{"width":1327,"height":150},"samsung-sans-num3Lv":{"width":1327,"height":150},"yunos-thin":{"width":1327,"height":150},"samsung-neo-num3T-cond":{"width":1327,"height":150},"Noto Sans Myanmar UI Bold":{"width":1327,"height":150},"lgserif":{"width":1327,"height":150},"FZYouHei-R-GB18030":{"width":1327,"height":150},"Lohit Punjabi":{"width":1327,"height":150},"baskerville":{"width":1327,"height":150},"samsung-sans-num4Tv":{"width":1327,"height":150},"samsung-sans-thin":{"width":1327,"height":150},"LG Emoji":{"width":1327,"height":150},"AnjaliNewLipi":{"width":1327,"height":150},"SamsungSansNum-4T Thin":{"width":1327,"height":150},"SamsungKorean-Bold":{"width":1327,"height":150},"miuiex-light":{"width":1327,"height":150},"Noto Sans Kannada":{"width":1327,"height":150},"Roboto Normal Italic":{"width":1327,"height":150},"Georgia Italic":{"width":1327,"height":150},"sans-serif-medium":{"width":1327,"height":150},"Smart Zawgyi":{"width":1327,"height":150},"Roboto Condensed Italic":{"width":1327,"height":150},"Noto Sans Kannada UI Bold":{"width":1327,"height":150},"DFP Sc Sans Heue30_103":{"width":1327,"height":150},"LG_Number_Roboto Bold":{"width":1327,"height":150},"Padauk Book":{"width":1327,"height":150},"x-sst-condensed":{"width":1327,"height":150},"Sunshine-Uchen":{"width":1327,"height":150},"Roboto Black Italic":{"width":1327,"height":150},"Ringo Color Emoji":{"width":1327,"height":150},"Devanagari OTS":{"width":1327,"height":150},"Smart Zawgyi Pro":{"width":1327,"height":150},"FZLanTingHei-M-GBK":{"width":1327,"height":150},"AndroidClock-Large Regular":{"width":1327,"height":150},"proportionally-spaced-without-serifs":{"width":1327,"height":150},"Cutive Mono":{"width":1327,"height":150},"times":{"width":1134,"height":126},"LG Smart_H test Bold":{"width":1327,"height":150},"DINPro-Light":{"width":1327,"height":150},"sans-serif-black":{"width":1327,"height":150},"Lohit Devanagari":{"width":1327,"height":150},"proportionally-spaced-with-serifs":{"width":1327,"height":150},"samsung-sans-num3L":{"width":1327,"height":150},"MYoung PRC Medium":{"width":1327,"height":150},"DFGothicPW5-BIG5HK-SONY":{"width":1327,"height":150},"hans-sans-medium":{"width":1327,"height":150},"SST Heavy":{"width":1327,"height":150},"LG-FZZhunYuan-M02-V2.2":{"width":1238,"height":137},"MyanmarUNew Regular":{"width":1327,"height":150},"Noto Naskh Arabic Bold":{"width":1327,"height":150},"SamsungGujarathiRegular":{"width":1327,"height":150},"fantasy":{"width":1123,"height":139},"helve-neue-light":{"width":1327,"height":150},"Helvetica Neue OTS Bold":{"width":1327,"height":150},"noto-sans-cjk-bold":{"width":1327,"height":150},"samsung-sans-num3R":{"width":1327,"height":150},"Lindsey Samsung":{"width":1327,"height":150},"samsung-sans-num3T":{"width":1327,"height":150},"ScreenSerifMono":{"width":1327,"height":150},"ETrump Myanmar_ZW":{"width":1327,"height":150},"helve-neue-thinextended":{"width":1327,"height":150},"Noto Naskh Arabic":{"width":1327,"height":150},"LG_Gujarati":{"width":1327,"height":150},"Smart_Monospaced":{"width":1327,"height":150},"Tamil Sangam MN":{"width":1327,"height":150},"LG Emoji NonAME":{"width":1327,"height":150},"Roboto Condensed Light Italic":{"width":1327,"height":150},"gm_jingkai":{"width":1327,"height":150},"FZLanTingKanHei_GB18030":{"width":1327,"height":150},"lgtravel":{"width":1327,"height":150},"palatino":{"width":1327,"height":150},"Georgia Bold":{"width":1327,"height":150},"Droid Sans":{"width":1327,"height":150},"LG_Punjabi":{"width":1327,"height":150},"SmartGothic Bold":{"width":1327,"height":150},"Samsung Sans Thin":{"width":1327,"height":150},"SST Condensed Bold":{"width":1327,"height":150},"Comics_Narrow":{"width":1327,"height":150},"courier":{"width":1095,"height":130},"Oriya Sangam MN":{"width":1327,"height":150},"helve-neue-lightextended":{"width":1327,"height":150},"FZLanTingHei-R-GB18030":{"width":1327,"height":150},"AR CrystalheiHKSCS DB":{"width":1327,"height":150},"serif":{"width":912,"height":114},"RTWSYueRoudGoG0v1-Regular":{"width":1327,"height":150},"MiaoWu_prev":{"width":1327,"height":150},"FZY1K":{"width":1327,"height":150},"LG_Number_Roboto Regular":{"width":1327,"height":150},"AndroidClock":{"width":1327,"height":150},"SoMA Regular":{"width":1327,"height":150},"HYQiHei-40S Lightx":{"width":1327,"height":150},"lg-sans-serif":{"width":1327,"height":150},"Dancing Script Bold":{"width":1327,"height":150},"default":{"width":1238,"height":137},"sec-roboto-light":{"width":1327,"height":150},"ColorOSUI-Regular":{"width":1327,"height":150},"test Regular":{"width":1327,"height":150},"Tamil Sangam MN Bold":{"width":1327,"height":150},"FZYingBiXingShu-S16":{"width":1327,"height":150},"RobotoNum3L Light":{"width":1327,"height":150},"monospaced-with-serifs":{"width":1327,"height":150},"samsung-sans-num35":{"width":1327,"height":150},"Cool jazz":{"width":1327,"height":150},"SamsungNeoNum-3L":{"width":1327,"height":150},"ScreenSansMono":{"width":1327,"height":150},"DFPWaWaW5-GB":{"width":1327,"height":150},"SamsungSansNum-3L Light":{"width":1327,"height":150},"Bangla Sangam MN":{"width":1327,"height":150},"Gurmukhi Sangam MN":{"width":1327,"height":150},"SECRobotoLight":{"width":1327,"height":150},"hyfonxrain":{"width":1327,"height":150},"MYingHeiGB18030C-Bold":{"width":1327,"height":150},"samsung-sans-light":{"width":1327,"height":150},"Helvetica LT 65 Medium":{"width":1238,"height":137},"Droid Sans Fallback":{"width":1327,"height":150},"Roboto Test1 Bold":{"width":1327,"height":150},"Noto Sans Myanmar Bold":{"width":1327,"height":150},"sans-serif-condensed-custom":{"width":1327,"height":150},"SamsungNeoNum-3T":{"width":1327,"height":150},"Samsung Sans Num35":{"width":1327,"height":150},"monospace":{"width":912,"height":114},"TL Mohanty Medium":{"width":1327,"height":150},"helve-neue-medium":{"width":1327,"height":150},"LTHYSZK":{"width":1327,"height":150},"Roboto Condensed custome Bold":{"width":1327,"height":150},"Myanmar3":{"width":1327,"height":150},"Droid Sans Devanagari":{"width":1327,"height":150},"ShaoNv_prev":{"width":1327,"height":150},"samsung-neo-num3L":{"width":1327,"height":150},"FZLanTingHei-EL-GBK":{"width":1327,"height":150},"yunos":{"width":1327,"height":150},"samsung-neo-num3T":{"width":1327,"height":150},"Times New Roman":{"width":1134,"height":126},"helve-neue-bold":{"width":1327,"height":150},"noto-sans-cjk-regular":{"width":1327,"height":150},"Noto Sans Gurmukhi UI Bold":{"width":1327,"height":150},"DINPro-black":{"width":1327,"height":150},"FZLanTingHei-EL-GB18030":{"width":1327,"height":150},"SST Vietnamese Medium":{"width":1327,"height":150},"Roboto Condensed Light":{"width":1327,"height":150},"SST Vietnamese Bold":{"width":1327,"height":150},"AR DJ-KK":{"width":1327,"height":150},"Droid Sans SEMC":{"width":1327,"height":150},"Noto Sans Myanmar UI":{"width":1327,"height":150},"Coming Soon":{"width":1327,"height":150},"MYuppy PRC Medium":{"width":1327,"height":150},"Rosemary":{"width":1327,"height":150},"Lohit Gujarati":{"width":1327,"height":150},"Roboto Condensed custom Bold":{"width":1327,"height":150},"FZLanTingHeiS-R-GB":{"width":1327,"height":150},"Helvetica Neue OTS":{"width":1327,"height":150},"Kaiti_prev":{"width":1327,"height":150},"Roboto-BigClock":{"width":1327,"height":150},"FZYBKSJW":{"width":1327,"height":150},"Handset Condensed Bold":{"width":1327,"height":150},"SamsungGeorgian":{"width":1327,"height":150},"Dancing Script":{"width":1327,"height":150},"sans-serif-condensed":{"width":1327,"height":150},"hans-sans-thin":{"width":1327,"height":150},"SamsungSansNum-4Tv Thin":{"width":1327,"height":150},"Lohit Odia":{"width":1327,"height":150},"BhashitaComplexSans":{"width":1327,"height":150}}

function boxMullerRandom() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0;
}
function getRealisticOffset(baseValue, correlationFactor = 0) {
    const stdDev = baseValue * (Math.random() * 0.005 + 0.003);
    let mainOffset = boxMullerRandom() * stdDev;
    let correlatedOffset = mainOffset + correlationFactor * stdDev * 0.5;
    if (Math.random() < 0.05) {
        correlatedOffset *= (Math.random() * 2 + 2);
    }
    return Math.round(correlatedOffset);
}
function applyRealisticNoise(spanStyleData) {
    Object.keys(spanStyleData).forEach(fontName => {
        const correlation = boxMullerRandom() * 0.6;
        const dimensions = spanStyleData[fontName];
        const widthOffset = getRealisticOffset(dimensions.width, correlation);
        const heightOffset = getRealisticOffset(dimensions.height, correlation);
        dimensions.width += widthOffset;
        dimensions.height += heightOffset;
    });
}
// 真实的随机
applyRealisticNoise(span_style);


xuxu_loginfo = false;
(()=>{
    const origin_log = console.log;
    xuxu_log = function(){
        if (xuxu_loginfo){
            return origin_log(...arguments)
        }
    }
})();
!(function () {
    xuxuwatch = function (obj, name) {
        return new Proxy(obj, {
            get(target, property, receiver) {
                var val = Reflect.get(...arguments);
                return val
            },
            set(target, property, newValue, receiver) {
                var val = Reflect.set(...arguments)
                return val
            }
        })
    }
})();


const syString = Symbol('ToString');
(()=> {
    'use strict';
    const $toString = Function.toString
    function ToString() {
        return typeof this == 'function' && this[syString] || $toString.call(this)
    }
    function to_native(fun, key, value) {
        Object.defineProperty(fun, key, {
            value: value,
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
    }
    delete Function.prototype['toString'];
    to_native(Function.prototype, 'toString', ToString)
    to_native(Function.prototype.toString, syString, "function toString() { [native code] }");
    to_native(Function.prototype.toString, 'name', "toString");
    global.fun_to_native=function (fun) {
        to_native(fun, syString, `function ${fun.name}() { [native code] }`)
    }
})(global);

xuxuxuxulog=console.log;
console.log=function log(){};
console.log[syString]='function log() { [native code] }';

console.table=function table(){};
console.table[syString]='function table() { [native code] }';

console.clear=function clear(){};
console.clear[syString]='function clear() { [native code] }';

getOwnPropertyDescriptor_=Object.getOwnPropertyDescriptor
Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(obj, prop) {
    if (obj === navigator && prop === 'userAgent') {
        return undefined
    }
    if (obj === navigator && prop === 'webdriver'){
        return undefined
    }
    return getOwnPropertyDescriptor_(obj, prop)
}
fun_to_native(Object.getOwnPropertyDescriptor);

getOwnPropertyDescriptors_=Object.getOwnPropertyDescriptors;
Object.getOwnPropertyDescriptors=function getOwnPropertyDescriptors(target) {
    xuxu_log('getOwnPropertyDescriptors=>', target, getOwnPropertyDescriptors_.call(this, target))
    if (target === Navigator.prototype){
        return nav_obj
    }
    debugger;
    return getOwnPropertyDescriptors_.call(this, target);
};
fun_to_native(Object.getOwnPropertyDescriptors)


EventTarget=function EventTarget(){}
addEventListener = function addEventListener(eventType, func) {
    if (eventType === 'load') {
        load_fun = func
        return
    }
};
fun_to_native(addEventListener)


dispatchEvent=function dispatchEvent() {
    xuxu_log('dispatchEvent=>',arguments)
    debugger
}
fun_to_native(dispatchEvent)
removeEventListener=function removeEventListener(){
    xuxu_log('removeEventListener=>',arguments)
    return ""
}
fun_to_native(removeEventListener)

when=function when(val){
    debugger
}
fun_to_native(when)

EventTarget.prototype={
    addEventListener:addEventListener,
    dispatchEvent:dispatchEvent,
    removeEventListener:removeEventListener,
    when:when,
    constructor:EventTarget,
}
Object.defineProperty(EventTarget.prototype, Symbol.toStringTag, {
    value: 'EventTarget',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(EventTarget)

WindowProperties=new EventTarget()
Object.defineProperty(WindowProperties, Symbol.toStringTag, {
    value: 'WindowProperties',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


Window=function Window(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

    }
} //不能new
Object.setPrototypeOf(Window, EventTarget)
Object.setPrototypeOf(Window.prototype, WindowProperties);
Window.prototype.PERSISTENT=1
Window.prototype.TEMPORARY=0
Object.defineProperty(Window.prototype, Symbol.toStringTag, {
    value: 'Window',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Window)

window=xuxuwatch(global,'window');
Object.defineProperty(window, 'window', {
    value: window,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: false, // 可选，设置为可配置
});
Object.defineProperty(window, Symbol.toStringTag, {
    value: 'Window',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
window.__proto__ = Window.prototype;


IDBFactory=function IDBFactory(val){
    debugger
}
fun_to_native(IDBFactory)
Object.defineProperty(IDBFactory.prototype, Symbol.toStringTag, {
    value:'IDBFactory',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(IDBFactory.prototype, 'constructor', {
    value:IDBFactory,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
open=function open(val){
    if(val==undefined){
        throw new TypeError("Failed to execute 'open' on 'IDBFactory': 1 argument required, but only 0 present.")
    }
    if (val === 'EkcP'){
        var ekcp = xuxuwatch({
            onblocked: null,
            onerror: null,
            onsuccess: null,
            onupgradeneeded: null,
            readyState: "pending",
            source: null,
            transaction: null,
        }, 'EkcP')
        return ekcp
    }
    debugger
    return window.indexedDB[val]
}
fun_to_native(open)
Object.defineProperty(IDBFactory.prototype, 'open', {
    value:open,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
cmp =function cmp(val){
    return window.indexedDB[val]
}
fun_to_native(open)
Object.defineProperty(IDBFactory.prototype, 'cmp', {
    value:cmp,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
databases=function databases(val){
    return window.indexedDB[val]
}
fun_to_native(databases)
Object.defineProperty(IDBFactory.prototype, 'databases', {
    value:databases,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
deleteDatabase=function deleteDatabase(val){
    return window.indexedDB[val]
}
fun_to_native(deleteDatabase)
Object.defineProperty(IDBFactory.prototype, 'deleteDatabase', {
    value:deleteDatabase,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
window.indexedDB=xuxuwatch({},'indexedDB')
window.indexedDB.__proto__=IDBFactory.prototype


const OriginalBlob = Blob;
Blob=function Blob(...args) {
    window.Blobcode=args[0][0];
    return new OriginalBlob(...args);
}
fun_to_native(Blob)
Blob.prototype = OriginalBlob.prototype;

Worker=class Worker {
    constructor(scriptCode) {
        if (!scriptCode) {
            throw new TypeError("Failed to construct 'Worker': 1 argument required.");
        }
        if (scriptCode.includes('blob')){
            scriptCode = window.Blobcode
        }
        // Worker 线程包装代码（在内存里执行）
        const workerCode = `
            self = global;
            OffscreenCanvas=function OffscreenCanvas(width, height){
                var offscreencanvas = {
                    getContext:function getContext(val){
                        if (val === 'webgl'){
                            var webgl = {
                                getExtension:function getExtension(val){
                                    if (val === "WEBGL_debug_renderer_info"){
                                        var wegl_info_obj = {
                                            [Symbol.toStringTag]:"WebGLDebugRendererInfo",
                                            UNMASKED_RENDERER_WEBGL: 37446,
                                            UNMASKED_VENDOR_WEBGL: 37445,
                                        };
                                        return wegl_info_obj
                                    }
                                },
                                getParameter:function getParameter(val){
                                    if (val === 37446){
                                        return "Google Inc. (NVIDIA)"
                                    }
                                    if (val === 37445){
                                        return "ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti (0x00001380) Direct3D11 vs_5_0 ps_5_0, D3D11)"
                                    }
                                },
                            }
                            return webgl
                        }
                    },
                }
                return offscreencanvas
            }
            Navigator=function Navigator(){}
            Navigator.prototype = {
                [Symbol.toStringTag]:'WorkerNavigator',
                appVersion: "${'5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0'}",
                userAgent: "${"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0"}",
                language:"zh-CN",
                languages:["zh-CN"],
                platform:'Win32',
                deviceMemory:8,
                hardwareConcurrency:8,
                gpu:{
                    requestAdapter:function(options) {
                        return Promise.resolve(null); // 直接返回 null,表示没有可用适配器
                    }
                },
                userAgentData:{
                    mobile:false,
                }
            }
            navigator={};
            Object.setPrototypeOf(navigator, Navigator.prototype);
            xuxuprocess=process;
            delete global;
            delete process;
            delete Buffer;
            globalThis = self;

            const { parentPort } = require("worker_threads");
            const postMessage = (msg) => parentPort.postMessage(msg);
            globalThis.postMessage = postMessage;
            globalThis.self = globalThis;
            parentPort.on("message", (msg) => {
                if (typeof onmessage === "function") {
                    onmessage({ data: msg });
                }
            });
            ${scriptCode}
        `;
        this.thread = new ThreadWorker(workerCode, { eval: true });
        this.onmessage = null;
        this.onerror = null;

        this.thread.on("message", (data) => {
            this.onmessage && this.onmessage({ data });
        });
        this.thread.on("error", (err) => {
            this.onerror && this.onerror(err);
        });
    }
    postMessage(msg) {
        this.thread.postMessage(msg);
    }
    terminate() {
        this.thread.terminate();
    }
};
Worker.__proto__ = EventTarget;
Worker.prototype.__proto__ = EventTarget.prototype;
fun_to_native(Worker);


performanceperformance=performance;
window.performance = xuxuwatch({}, 'performance');

performance.now=function now(){
    return performanceperformance.now()
}
fun_to_native(performance.now)

function getRandomMemory__() {
  const jsHeapSizeLimit = Math.floor(2 * 1024 * 1024 * 1024 + Math.random() * 2 * 1024 * 1024 * 1024);
  const totalJSHeapSize = Math.floor(jsHeapSizeLimit * (0.1 + Math.random() * 0.7));
  const usedJSHeapSize = Math.floor(totalJSHeapSize * (0.7 + Math.random() * 0.3));
  return {
    jsHeapSizeLimit,
    totalJSHeapSize,
    usedJSHeapSize
  };
}
var memory__ = getRandomMemory__();

window.performance.memory = xuxuwatch({
    jsHeapSizeLimit: memory__.jsHeapSizeLimit,
    totalJSHeapSize: memory__.totalJSHeapSize,
    usedJSHeapSize: memory__.usedJSHeapSize,
},"window.performance.memory")
var ZDtimeOrigin = Date.now();
var ZDresponseEnd = ZDtimeOrigin + Math.floor(Math.random() * 51) + 50;
var ZDresponseStart = ZDresponseEnd - Math.floor(Math.random() * 5);
window.performance.timeOrigin = ZDtimeOrigin;
window.performance.navigation = {"type":1,"redirectCount":0};
window.performance.timing = xuxuwatch({
    connectEnd:ZDtimeOrigin,
    connectStart:ZDtimeOrigin,
    responseEnd:ZDresponseEnd,
    responseStart:ZDresponseStart,
},"window.performance.timing");

window.performance.getEntries=function getEntries(ele){
    debugger
};
fun_to_native(window.performance.getEntries)

window.performance.getEntriesByName=function getEntriesByName(str) {
    debugger
}
fun_to_native(window.performance.getEntriesByName)

window.performance.getEntriesByType=function getEntriesByType(type){
    debugger
}
fun_to_native(window.performance.getEntriesByType)


window.captureEvents=function captureEvents(){
    debugger
    xuxu_log('captureEvents=>')
}
fun_to_native(captureEvents)

window.releaseEvents=function releaseEvents(){
    debugger
    xuxu_log('releaseEvents=>')
}
fun_to_native(releaseEvents)




window.getComputedStyle=function getComputedStyle(val){
    xuxu_log('getComputedStyle=>', val.toString())
    if (val===document.documentElement){
        debugger;
        var res = xuxuwatch({"0":"accent-color","1":"align-content","2":"align-items","3":"align-self","4":"alignment-baseline","5":"anchor-name","6":"anchor-scope","7":"animation-composition","8":"animation-delay","9":"animation-direction","10":"animation-duration","11":"animation-fill-mode","12":"animation-iteration-count","13":"animation-name","14":"animation-play-state","15":"animation-range-end","16":"animation-range-start","17":"animation-timeline","18":"animation-timing-function","19":"app-region","20":"appearance","21":"backdrop-filter","22":"backface-visibility","23":"background-attachment","24":"background-blend-mode","25":"background-clip","26":"background-color","27":"background-image","28":"background-origin","29":"background-position","30":"background-repeat","31":"background-size","32":"baseline-shift","33":"baseline-source","34":"block-size","35":"border-block-end-color","36":"border-block-end-style","37":"border-block-end-width","38":"border-block-start-color","39":"border-block-start-style","40":"border-block-start-width","41":"border-bottom-color","42":"border-bottom-left-radius","43":"border-bottom-right-radius","44":"border-bottom-style","45":"border-bottom-width","46":"border-collapse","47":"border-end-end-radius","48":"border-end-start-radius","49":"border-image-outset","50":"border-image-repeat","51":"border-image-slice","52":"border-image-source","53":"border-image-width","54":"border-inline-end-color","55":"border-inline-end-style","56":"border-inline-end-width","57":"border-inline-start-color","58":"border-inline-start-style","59":"border-inline-start-width","60":"border-left-color","61":"border-left-style","62":"border-left-width","63":"border-right-color","64":"border-right-style","65":"border-right-width","66":"border-start-end-radius","67":"border-start-start-radius","68":"border-top-color","69":"border-top-left-radius","70":"border-top-right-radius","71":"border-top-style","72":"border-top-width","73":"bottom","74":"box-decoration-break","75":"box-shadow","76":"box-sizing","77":"break-after","78":"break-before","79":"break-inside","80":"buffered-rendering","81":"caption-side","82":"caret-color","83":"clear","84":"clip","85":"clip-path","86":"clip-rule","87":"color","88":"color-interpolation","89":"color-interpolation-filters","90":"color-rendering","91":"column-count","92":"column-gap","93":"column-rule-color","94":"column-rule-style","95":"column-rule-width","96":"column-span","97":"column-width","98":"contain-intrinsic-block-size","99":"contain-intrinsic-height","100":"contain-intrinsic-inline-size","101":"contain-intrinsic-size","102":"contain-intrinsic-width","103":"container-name","104":"container-type","105":"content","106":"cursor","107":"cx","108":"cy","109":"d","110":"direction","111":"display","112":"dominant-baseline","113":"empty-cells","114":"field-sizing","115":"fill","116":"fill-opacity","117":"fill-rule","118":"filter","119":"flex-basis","120":"flex-direction","121":"flex-grow","122":"flex-shrink","123":"flex-wrap","124":"float","125":"flood-color","126":"flood-opacity","127":"font-family","128":"font-kerning","129":"font-optical-sizing","130":"font-palette","131":"font-size","132":"font-size-adjust","133":"font-stretch","134":"font-style","135":"font-synthesis-small-caps","136":"font-synthesis-style","137":"font-synthesis-weight","138":"font-variant","139":"font-variant-alternates","140":"font-variant-caps","141":"font-variant-east-asian","142":"font-variant-emoji","143":"font-variant-ligatures","144":"font-variant-numeric","145":"font-variant-position","146":"font-weight","147":"grid-auto-columns","148":"grid-auto-flow","149":"grid-auto-rows","150":"grid-column-end","151":"grid-column-start","152":"grid-row-end","153":"grid-row-start","154":"grid-template-areas","155":"grid-template-columns","156":"grid-template-rows","157":"height","158":"hyphenate-character","159":"hyphenate-limit-chars","160":"hyphens","161":"image-orientation","162":"image-rendering","163":"initial-letter","164":"inline-size","165":"inset-block-end","166":"inset-block-start","167":"inset-inline-end","168":"inset-inline-start","169":"interactivity","170":"interpolate-size","171":"isolation","172":"justify-content","173":"justify-items","174":"justify-self","175":"left","176":"letter-spacing","177":"lighting-color","178":"line-break","179":"line-height","180":"list-style-image","181":"list-style-position","182":"list-style-type","183":"margin-block-end","184":"margin-block-start","185":"margin-bottom","186":"margin-inline-end","187":"margin-inline-start","188":"margin-left","189":"margin-right","190":"margin-top","191":"marker-end","192":"marker-mid","193":"marker-start","194":"mask-clip","195":"mask-composite","196":"mask-image","197":"mask-mode","198":"mask-origin","199":"mask-position","200":"mask-repeat","201":"mask-size","202":"mask-type","203":"math-depth","204":"math-shift","205":"math-style","206":"max-block-size","207":"max-height","208":"max-inline-size","209":"max-width","210":"min-block-size","211":"min-height","212":"min-inline-size","213":"min-width","214":"mix-blend-mode","215":"object-fit","216":"object-position","217":"object-view-box","218":"offset-anchor","219":"offset-distance","220":"offset-path","221":"offset-position","222":"offset-rotate","223":"opacity","224":"order","225":"orphans","226":"outline-color","227":"outline-offset","228":"outline-style","229":"outline-width","230":"overflow-anchor","231":"overflow-block","232":"overflow-clip-margin","233":"overflow-inline","234":"overflow-wrap","235":"overflow-x","236":"overflow-y","237":"overlay","238":"overscroll-behavior-block","239":"overscroll-behavior-inline","240":"padding-block-end","241":"padding-block-start","242":"padding-bottom","243":"padding-inline-end","244":"padding-inline-start","245":"padding-left","246":"padding-right","247":"padding-top","248":"paint-order","249":"perspective","250":"perspective-origin","251":"pointer-events","252":"position","253":"position-anchor","254":"position-area","255":"position-try-fallbacks","256":"position-try-order","257":"position-visibility","258":"r","259":"reading-flow","260":"resize","261":"right","262":"rotate","263":"row-gap","264":"ruby-align","265":"ruby-position","266":"rx","267":"ry","268":"scale","269":"scroll-behavior","270":"scroll-initial-target","271":"scroll-margin-block-end","272":"scroll-margin-block-start","273":"scroll-margin-inline-end","274":"scroll-margin-inline-start","275":"scroll-marker-group","276":"scroll-padding-block-end","277":"scroll-padding-block-start","278":"scroll-padding-inline-end","279":"scroll-padding-inline-start","280":"scroll-timeline-axis","281":"scroll-timeline-name","282":"scrollbar-color","283":"scrollbar-gutter","284":"scrollbar-width","285":"shape-image-threshold","286":"shape-margin","287":"shape-outside","288":"shape-rendering","289":"speak","290":"stop-color","291":"stop-opacity","292":"stroke","293":"stroke-dasharray","294":"stroke-dashoffset","295":"stroke-linecap","296":"stroke-linejoin","297":"stroke-miterlimit","298":"stroke-opacity","299":"stroke-width","300":"tab-size","301":"table-layout","302":"text-align","303":"text-align-last","304":"text-anchor","305":"text-box-edge","306":"text-box-trim","307":"text-decoration","308":"text-decoration-color","309":"text-decoration-line","310":"text-decoration-skip-ink","311":"text-decoration-style","312":"text-emphasis-color","313":"text-emphasis-position","314":"text-emphasis-style","315":"text-indent","316":"text-overflow","317":"text-rendering","318":"text-shadow","319":"text-size-adjust","320":"text-spacing-trim","321":"text-transform","322":"text-underline-position","323":"text-wrap-mode","324":"text-wrap-style","325":"timeline-scope","326":"top","327":"touch-action","328":"transform","329":"transform-origin","330":"transform-style","331":"transition-behavior","332":"transition-delay","333":"transition-duration","334":"transition-property","335":"transition-timing-function","336":"translate","337":"unicode-bidi","338":"user-select","339":"vector-effect","340":"vertical-align","341":"view-timeline-axis","342":"view-timeline-inset","343":"view-timeline-name","344":"view-transition-class","345":"view-transition-name","346":"visibility","347":"white-space-collapse","348":"widows","349":"width","350":"will-change","351":"word-break","352":"word-spacing","353":"writing-mode","354":"x","355":"y","356":"z-index","357":"zoom","358":"-webkit-border-horizontal-spacing","359":"-webkit-border-image","360":"-webkit-border-vertical-spacing","361":"-webkit-box-align","362":"-webkit-box-decoration-break","363":"-webkit-box-direction","364":"-webkit-box-flex","365":"-webkit-box-ordinal-group","366":"-webkit-box-orient","367":"-webkit-box-pack","368":"-webkit-box-reflect","369":"-webkit-font-smoothing","370":"-webkit-line-break","371":"-webkit-line-clamp","372":"-webkit-locale","373":"-webkit-mask-box-image","374":"-webkit-mask-box-image-outset","375":"-webkit-mask-box-image-repeat","376":"-webkit-mask-box-image-slice","377":"-webkit-mask-box-image-source","378":"-webkit-mask-box-image-width","379":"-webkit-print-color-adjust","380":"-webkit-rtl-ordering","381":"-webkit-tap-highlight-color","382":"-webkit-text-combine","383":"-webkit-text-decorations-in-effect","384":"-webkit-text-fill-color","385":"-webkit-text-orientation","386":"-webkit-text-security","387":"-webkit-text-stroke-color","388":"-webkit-text-stroke-width","389":"-webkit-user-drag","390":"-webkit-user-modify","391":"-webkit-writing-mode","accentColor":"auto","additiveSymbols":"","alignContent":"normal","alignItems":"normal","alignSelf":"auto","alignmentBaseline":"auto","all":"","anchorName":"none","anchorScope":"none","animation":"none 0s ease 0s 1 normal none running","animationComposition":"replace","animationDelay":"0s","animationDirection":"normal","animationDuration":"0s","animationFillMode":"none","animationIterationCount":"1","animationName":"none","animationPlayState":"running","animationRange":"normal","animationRangeEnd":"normal","animationRangeStart":"normal","animationTimeline":"auto","animationTimingFunction":"ease","appRegion":"none","appearance":"none","ascentOverride":"","aspectRatio":"auto","backdropFilter":"none","backfaceVisibility":"visible","background":"rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box","backgroundAttachment":"scroll","backgroundBlendMode":"normal","backgroundClip":"border-box","backgroundColor":"rgba(0, 0, 0, 0)","backgroundImage":"none","backgroundOrigin":"padding-box","backgroundPosition":"0% 0%","backgroundPositionX":"0%","backgroundPositionY":"0%","backgroundRepeat":"repeat","backgroundSize":"auto","basePalette":"","baselineShift":"0px","baselineSource":"auto","blockSize":"772.6px","border":"0px none rgb(0, 0, 0)","borderBlock":"0px none rgb(0, 0, 0)","borderBlockColor":"rgb(0, 0, 0)","borderBlockEnd":"0px none rgb(0, 0, 0)","borderBlockEndColor":"rgb(0, 0, 0)","borderBlockEndStyle":"none","borderBlockEndWidth":"0px","borderBlockStart":"0px none rgb(0, 0, 0)","borderBlockStartColor":"rgb(0, 0, 0)","borderBlockStartStyle":"none","borderBlockStartWidth":"0px","borderBlockStyle":"none","borderBlockWidth":"0px","borderBottom":"0px none rgb(0, 0, 0)","borderBottomColor":"rgb(0, 0, 0)","borderBottomLeftRadius":"0px","borderBottomRightRadius":"0px","borderBottomStyle":"none","borderBottomWidth":"0px","borderCollapse":"separate","borderColor":"rgb(0, 0, 0)","borderEndEndRadius":"0px","borderEndStartRadius":"0px","borderImage":"none","borderImageOutset":"0","borderImageRepeat":"stretch","borderImageSlice":"100%","borderImageSource":"none","borderImageWidth":"1","borderInline":"0px none rgb(0, 0, 0)","borderInlineColor":"rgb(0, 0, 0)","borderInlineEnd":"0px none rgb(0, 0, 0)","borderInlineEndColor":"rgb(0, 0, 0)","borderInlineEndStyle":"none","borderInlineEndWidth":"0px","borderInlineStart":"0px none rgb(0, 0, 0)","borderInlineStartColor":"rgb(0, 0, 0)","borderInlineStartStyle":"none","borderInlineStartWidth":"0px","borderInlineStyle":"none","borderInlineWidth":"0px","borderLeft":"0px none rgb(0, 0, 0)","borderLeftColor":"rgb(0, 0, 0)","borderLeftStyle":"none","borderLeftWidth":"0px","borderRadius":"0px","borderRight":"0px none rgb(0, 0, 0)","borderRightColor":"rgb(0, 0, 0)","borderRightStyle":"none","borderRightWidth":"0px","borderSpacing":"0px 0px","borderStartEndRadius":"0px","borderStartStartRadius":"0px","borderStyle":"none","borderTop":"0px none rgb(0, 0, 0)","borderTopColor":"rgb(0, 0, 0)","borderTopLeftRadius":"0px","borderTopRightRadius":"0px","borderTopStyle":"none","borderTopWidth":"0px","borderWidth":"0px","bottom":"auto","boxDecorationBreak":"slice","boxShadow":"none","boxSizing":"border-box","breakAfter":"auto","breakBefore":"auto","breakInside":"auto","bufferedRendering":"auto","captionSide":"top","caretColor":"rgb(0, 0, 0)","clear":"none","clip":"auto","clipPath":"none","clipRule":"nonzero","color":"rgb(0, 0, 0)","colorInterpolation":"srgb","colorInterpolationFilters":"linearrgb","colorRendering":"auto","colorScheme":"normal","columnCount":"auto","columnFill":"balance","columnGap":"normal","columnRule":"0px none rgb(0, 0, 0)","columnRuleColor":"rgb(0, 0, 0)","columnRuleStyle":"none","columnRuleWidth":"0px","columnSpan":"none","columnWidth":"auto","columns":"auto auto","contain":"none","containIntrinsicBlockSize":"none","containIntrinsicHeight":"none","containIntrinsicInlineSize":"none","containIntrinsicSize":"none","containIntrinsicWidth":"none","container":"none","containerName":"none","containerType":"normal","content":"normal","contentVisibility":"visible","counterIncrement":"none","counterReset":"none","counterSet":"none","cursor":"auto","cx":"0px","cy":"0px","d":"none","descentOverride":"","direction":"ltr","display":"block","dominantBaseline":"auto","emptyCells":"show","fallback":"","fieldSizing":"fixed","fill":"rgb(0, 0, 0)","fillOpacity":"1","fillRule":"nonzero","filter":"none","flex":"0 1 auto","flexBasis":"auto","flexDirection":"row","flexFlow":"row nowrap","flexGrow":"0","flexShrink":"1","flexWrap":"nowrap","float":"none","floodColor":"rgb(0, 0, 0)","floodOpacity":"1","font":"16px \"Microsoft YaHei\"","fontDisplay":"","fontFamily":"\"Microsoft YaHei\"","fontFeatureSettings":"normal","fontKerning":"auto","fontOpticalSizing":"auto","fontPalette":"normal","fontSize":"16px","fontSizeAdjust":"none","fontStretch":"100%","fontStyle":"normal","fontSynthesis":"weight style small-caps","fontSynthesisSmallCaps":"auto","fontSynthesisStyle":"auto","fontSynthesisWeight":"auto","fontVariant":"normal","fontVariantAlternates":"normal","fontVariantCaps":"normal","fontVariantEastAsian":"normal","fontVariantEmoji":"normal","fontVariantLigatures":"normal","fontVariantNumeric":"normal","fontVariantPosition":"normal","fontVariationSettings":"normal","fontWeight":"400","forcedColorAdjust":"auto","gap":"normal","grid":"none / none / none / row / auto / auto","gridArea":"auto","gridAutoColumns":"auto","gridAutoFlow":"row","gridAutoRows":"auto","gridColumn":"auto","gridColumnEnd":"auto","gridColumnGap":"normal","gridColumnStart":"auto","gridGap":"normal","gridRow":"auto","gridRowEnd":"auto","gridRowGap":"normal","gridRowStart":"auto","gridTemplate":"none","gridTemplateAreas":"none","gridTemplateColumns":"none","gridTemplateRows":"none","height":"772.6px","hyphenateCharacter":"auto","hyphenateLimitChars":"auto","hyphens":"manual","imageOrientation":"from-image","imageRendering":"auto","inherits":"","initialLetter":"normal","initialValue":"","inlineSize":"484.8px","inset":"auto","insetBlock":"auto","insetBlockEnd":"auto","insetBlockStart":"auto","insetInline":"auto","insetInlineEnd":"auto","insetInlineStart":"auto","interactivity":"auto","interpolateSize":"numeric-only","isolation":"auto","justifyContent":"normal","justifyItems":"normal","justifySelf":"auto","left":"auto","letterSpacing":"normal","lightingColor":"rgb(255, 255, 255)","lineBreak":"auto","lineGapOverride":"","lineHeight":"normal","listStyle":"outside none disc","listStyleImage":"none","listStylePosition":"outside","listStyleType":"disc","margin":"0px","marginBlock":"0px","marginBlockEnd":"0px","marginBlockStart":"0px","marginBottom":"0px","marginInline":"0px","marginInlineEnd":"0px","marginInlineStart":"0px","marginLeft":"0px","marginRight":"0px","marginTop":"0px","marker":"none","markerEnd":"none","markerMid":"none","markerStart":"none","mask":"none","maskClip":"border-box","maskComposite":"add","maskImage":"none","maskMode":"match-source","maskOrigin":"border-box","maskPosition":"0% 0%","maskRepeat":"repeat","maskSize":"auto","maskType":"luminance","mathDepth":"0","mathShift":"normal","mathStyle":"normal","maxBlockSize":"none","maxHeight":"none","maxInlineSize":"none","maxWidth":"none","minBlockSize":"0px","minHeight":"0px","minInlineSize":"0px","minWidth":"0px","mixBlendMode":"normal","navigation":"","negative":"","objectFit":"fill","objectPosition":"50% 50%","objectViewBox":"none","offset":"none 0px auto 0deg","offsetAnchor":"auto","offsetDistance":"0px","offsetPath":"none","offsetPosition":"normal","offsetRotate":"auto 0deg","opacity":"1","order":"0","orphans":"2","outline":"rgb(0, 0, 0) none 0px","outlineColor":"rgb(0, 0, 0)","outlineOffset":"0px","outlineStyle":"none","outlineWidth":"0px","overflow":"visible","overflowAnchor":"auto","overflowBlock":"visible","overflowClipMargin":"0px","overflowInline":"visible","overflowWrap":"normal","overflowX":"visible","overflowY":"visible","overlay":"none","overrideColors":"","overscrollBehavior":"auto","overscrollBehaviorBlock":"auto","overscrollBehaviorInline":"auto","overscrollBehaviorX":"auto","overscrollBehaviorY":"auto","pad":"","padding":"0px","paddingBlock":"0px","paddingBlockEnd":"0px","paddingBlockStart":"0px","paddingBottom":"0px","paddingInline":"0px","paddingInlineEnd":"0px","paddingInlineStart":"0px","paddingLeft":"0px","paddingRight":"0px","paddingTop":"0px","page":"auto","pageBreakAfter":"auto","pageBreakBefore":"auto","pageBreakInside":"auto","pageOrientation":"","paintOrder":"normal","perspective":"none","perspectiveOrigin":"242.4px 386.3px","placeContent":"normal","placeItems":"normal","placeSelf":"auto","pointerEvents":"auto","position":"static","positionAnchor":"auto","positionArea":"none","positionTry":"none","positionTryFallbacks":"none","positionTryOrder":"normal","positionVisibility":"always","prefix":"","quotes":"auto","r":"0px","range":"","readingFlow":"normal","resize":"none","right":"auto","rotate":"none","rowGap":"normal","rubyAlign":"space-around","rubyPosition":"over","rx":"auto","ry":"auto","scale":"none","scrollBehavior":"auto","scrollInitialTarget":"none","scrollMargin":"0px","scrollMarginBlock":"0px","scrollMarginBlockEnd":"0px","scrollMarginBlockStart":"0px","scrollMarginBottom":"0px","scrollMarginInline":"0px","scrollMarginInlineEnd":"0px","scrollMarginInlineStart":"0px","scrollMarginLeft":"0px","scrollMarginRight":"0px","scrollMarginTop":"0px","scrollMarkerGroup":"none","scrollPadding":"auto","scrollPaddingBlock":"auto","scrollPaddingBlockEnd":"auto","scrollPaddingBlockStart":"auto","scrollPaddingBottom":"auto","scrollPaddingInline":"auto","scrollPaddingInlineEnd":"auto","scrollPaddingInlineStart":"auto","scrollPaddingLeft":"auto","scrollPaddingRight":"auto","scrollPaddingTop":"auto","scrollSnapAlign":"none","scrollSnapStop":"normal","scrollSnapType":"none","scrollTimeline":"none","scrollTimelineAxis":"block","scrollTimelineName":"none","scrollbarColor":"auto","scrollbarGutter":"auto","scrollbarWidth":"auto","shapeImageThreshold":"0","shapeMargin":"0px","shapeOutside":"none","shapeRendering":"auto","size":"","sizeAdjust":"","speak":"normal","speakAs":"","src":"","stopColor":"rgb(0, 0, 0)","stopOpacity":"1","stroke":"none","strokeDasharray":"none","strokeDashoffset":"0px","strokeLinecap":"butt","strokeLinejoin":"miter","strokeMiterlimit":"4","strokeOpacity":"1","strokeWidth":"1px","suffix":"","symbols":"","syntax":"","system":"","tabSize":"8","tableLayout":"auto","textAlign":"start","textAlignLast":"auto","textAnchor":"start","textBox":"normal","textBoxEdge":"auto","textBoxTrim":"none","textCombineUpright":"none","textDecoration":"none solid rgb(0, 0, 0)","textDecorationColor":"rgb(0, 0, 0)","textDecorationLine":"none","textDecorationSkipInk":"auto","textDecorationStyle":"solid","textDecorationThickness":"auto","textEmphasis":"none rgb(0, 0, 0)","textEmphasisColor":"rgb(0, 0, 0)","textEmphasisPosition":"over","textEmphasisStyle":"none","textIndent":"0px","textOrientation":"mixed","textOverflow":"clip","textRendering":"auto","textShadow":"none","textSizeAdjust":"auto","textSpacingTrim":"normal","textTransform":"none","textUnderlineOffset":"auto","textUnderlinePosition":"auto","textWrap":"wrap","textWrapMode":"wrap","textWrapStyle":"auto","timelineScope":"none","top":"auto","touchAction":"auto","transform":"none","transformBox":"view-box","transformOrigin":"242.4px 386.3px","transformStyle":"flat","transition":"all","transitionBehavior":"normal","transitionDelay":"0s","transitionDuration":"0s","transitionProperty":"all","transitionTimingFunction":"ease","translate":"none","types":"","unicodeBidi":"isolate","unicodeRange":"","userSelect":"auto","vectorEffect":"none","verticalAlign":"baseline","viewTimeline":"none","viewTimelineAxis":"block","viewTimelineInset":"auto","viewTimelineName":"none","viewTransitionClass":"none","viewTransitionName":"root","visibility":"visible","webkitAlignContent":"normal","webkitAlignItems":"normal","webkitAlignSelf":"auto","webkitAnimation":"none 0s ease 0s 1 normal none running","webkitAnimationDelay":"0s","webkitAnimationDirection":"normal","webkitAnimationDuration":"0s","webkitAnimationFillMode":"none","webkitAnimationIterationCount":"1","webkitAnimationName":"none","webkitAnimationPlayState":"running","webkitAnimationTimingFunction":"ease","webkitAppRegion":"none","webkitAppearance":"none","webkitBackfaceVisibility":"visible","webkitBackgroundClip":"border-box","webkitBackgroundOrigin":"padding-box","webkitBackgroundSize":"auto","webkitBorderAfter":"0px none rgb(0, 0, 0)","webkitBorderAfterColor":"rgb(0, 0, 0)","webkitBorderAfterStyle":"none","webkitBorderAfterWidth":"0px","webkitBorderBefore":"0px none rgb(0, 0, 0)","webkitBorderBeforeColor":"rgb(0, 0, 0)","webkitBorderBeforeStyle":"none","webkitBorderBeforeWidth":"0px","webkitBorderBottomLeftRadius":"0px","webkitBorderBottomRightRadius":"0px","webkitBorderEnd":"0px none rgb(0, 0, 0)","webkitBorderEndColor":"rgb(0, 0, 0)","webkitBorderEndStyle":"none","webkitBorderEndWidth":"0px","webkitBorderHorizontalSpacing":"0px","webkitBorderImage":"none","webkitBorderRadius":"0px","webkitBorderStart":"0px none rgb(0, 0, 0)","webkitBorderStartColor":"rgb(0, 0, 0)","webkitBorderStartStyle":"none","webkitBorderStartWidth":"0px","webkitBorderTopLeftRadius":"0px","webkitBorderTopRightRadius":"0px","webkitBorderVerticalSpacing":"0px","webkitBoxAlign":"stretch","webkitBoxDecorationBreak":"slice","webkitBoxDirection":"normal","webkitBoxFlex":"0","webkitBoxOrdinalGroup":"1","webkitBoxOrient":"horizontal","webkitBoxPack":"start","webkitBoxReflect":"none","webkitBoxShadow":"none","webkitBoxSizing":"border-box","webkitClipPath":"none","webkitColumnBreakAfter":"auto","webkitColumnBreakBefore":"auto","webkitColumnBreakInside":"auto","webkitColumnCount":"auto","webkitColumnGap":"normal","webkitColumnRule":"0px none rgb(0, 0, 0)","webkitColumnRuleColor":"rgb(0, 0, 0)","webkitColumnRuleStyle":"none","webkitColumnRuleWidth":"0px","webkitColumnSpan":"none","webkitColumnWidth":"auto","webkitColumns":"auto auto","webkitFilter":"none","webkitFlex":"0 1 auto","webkitFlexBasis":"auto","webkitFlexDirection":"row","webkitFlexFlow":"row nowrap","webkitFlexGrow":"0","webkitFlexShrink":"1","webkitFlexWrap":"nowrap","webkitFontFeatureSettings":"normal","webkitFontSmoothing":"auto","webkitHyphenateCharacter":"auto","webkitJustifyContent":"normal","webkitLineBreak":"auto","webkitLineClamp":"none","webkitLocale":"\"zh-hans\"","webkitLogicalHeight":"772.6px","webkitLogicalWidth":"484.8px","webkitMarginAfter":"0px","webkitMarginBefore":"0px","webkitMarginEnd":"0px","webkitMarginStart":"0px","webkitMask":"none","webkitMaskBoxImage":"none","webkitMaskBoxImageOutset":"0","webkitMaskBoxImageRepeat":"stretch","webkitMaskBoxImageSlice":"0 fill","webkitMaskBoxImageSource":"none","webkitMaskBoxImageWidth":"auto","webkitMaskClip":"border-box","webkitMaskComposite":"add","webkitMaskImage":"none","webkitMaskOrigin":"border-box","webkitMaskPosition":"0% 0%","webkitMaskPositionX":"0%","webkitMaskPositionY":"0%","webkitMaskRepeat":"repeat","webkitMaskSize":"auto","webkitMaxLogicalHeight":"none","webkitMaxLogicalWidth":"none","webkitMinLogicalHeight":"0px","webkitMinLogicalWidth":"0px","webkitOpacity":"1","webkitOrder":"0","webkitPaddingAfter":"0px","webkitPaddingBefore":"0px","webkitPaddingEnd":"0px","webkitPaddingStart":"0px","webkitPerspective":"none","webkitPerspectiveOrigin":"242.4px 386.3px","webkitPerspectiveOriginX":"","webkitPerspectiveOriginY":"","webkitPrintColorAdjust":"economy","webkitRtlOrdering":"logical","webkitRubyPosition":"before","webkitShapeImageThreshold":"0","webkitShapeMargin":"0px","webkitShapeOutside":"none","webkitTapHighlightColor":"rgba(0, 0, 0, 0)","webkitTextCombine":"none","webkitTextDecorationsInEffect":"none","webkitTextEmphasis":"none rgb(0, 0, 0)","webkitTextEmphasisColor":"rgb(0, 0, 0)","webkitTextEmphasisPosition":"over","webkitTextEmphasisStyle":"none","webkitTextFillColor":"rgb(0, 0, 0)","webkitTextOrientation":"vertical-right","webkitTextSecurity":"none","webkitTextSizeAdjust":"auto","webkitTextStroke":"0px rgb(0, 0, 0)","webkitTextStrokeColor":"rgb(0, 0, 0)","webkitTextStrokeWidth":"0px","webkitTransform":"none","webkitTransformOrigin":"242.4px 386.3px","webkitTransformOriginX":"","webkitTransformOriginY":"","webkitTransformOriginZ":"","webkitTransformStyle":"flat","webkitTransition":"all","webkitTransitionDelay":"0s","webkitTransitionDuration":"0s","webkitTransitionProperty":"all","webkitTransitionTimingFunction":"ease","webkitUserDrag":"auto","webkitUserModify":"read-only","webkitUserSelect":"auto","webkitWritingMode":"horizontal-tb","whiteSpace":"normal","whiteSpaceCollapse":"collapse","widows":"2","width":"484.8px","willChange":"auto","wordBreak":"normal","wordSpacing":"0px","wordWrap":"normal","writingMode":"horizontal-tb","x":"0px","y":"0px","zIndex":"auto","zoom":"1"}, 'CSS')
        res.__proto__=CSSStyleDeclaration.prototype;
        return res
    }
    debugger
}
fun_to_native(getComputedStyle)

window.CDATASection=function CDATASection(){
    debugger
}
remove=function remove(){
    debugger
}
fun_to_native(remove)
Object.defineProperty(CDATASection.prototype, 'remove', {
    value:remove,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(CDATASection)


window.Notification=function Notification(ele){
    debugger
}
fun_to_native(Notification)

window.Path2D=function Path2D(){
    debugger
}
fun_to_native(Path2D)

addPath=function addPath(val){
    debugger
}
fun_to_native(addPath)
Object.defineProperty(Path2D.prototype, 'addPath', {
    value:addPath,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete addPath;


window.TextTrackList=function TextTrackList(){
    debugger
}
fun_to_native(TextTrackList)
getTrackById=function getTrackById(val){
    debugger
}
fun_to_native(getTrackById)
Object.defineProperty(TextTrackList.prototype, 'getTrackById', {
    value:getTrackById,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getTrackById;


window.getSelection=function getSelection(){
    debugger
}
fun_to_native(getSelection)

window.SVGPatternElement=function SVGPatternElement(){
    debugger
}
fun_to_native(SVGPatternElement)

window.MutationRecord=function MutationRecord(){
    debugger
}
fun_to_native(MutationRecord)


xuxuRequest=Request;
window.Request=function Request(ele){
    xuxu_log('window.Request=>',ele)
    debugger
}
Requestclone=function clone(){
    debugger
}
fun_to_native(Requestclone);
Request.prototype=xuxuwatch({
    clone:Requestclone
}, 'Request.prototype');
fun_to_native(window.Request);

window.Headers=function Headers(ele){
    xuxu_log('window.Headers=>',ele)
    debugger
}
Headers.prototype=xuxuwatch({}, 'Headers.prototype');
fun_to_native(window.Headers)

window.fetch=function fetch(val){
    debugger
}
fetch.prototype=xuxuwatch({}, 'fetch.prototype');


window.WebSocket=function WebSocket(ele){
    xuxu_log('window.WebSocket=>',ele)
    if (ele.includes('w://')){
        throw new TypeError("Failed to construct 'WebSocket': The URL's scheme must be either 'http', 'https', 'ws', or 'wss'. 'file' is not allowed.");
    }
}
fun_to_native(window.WebSocket)

window.DOMParser=function DOMParser(ele){
    xuxu_log('window.DOMParser=>',ele)
    debugger
}
fun_to_native(window.DOMParser)

window.Image=function Image(ele){
    xuxu_log('window.Image=>',ele)
    var img = xuxuwatch({}, 'Image')
    return img
}
fun_to_native(window.Image)

window.MediaEncryptedEvent=function MediaEncryptedEvent(ele){
    xuxu_log('MediaEncryptedEvent=>', ele)
    debugger
}
fun_to_native(MediaEncryptedEvent)


window.ScreenOrientation=function ScreenOrientation(ele){
    xuxu_log('ScreenOrientation=>',ele)
    debugger
}
fun_to_native(window.ScreenOrientation)


window.SpeechSynthesisUtterance=function SpeechSynthesisUtterance(ele){
    xuxu_log('SpeechSynthesisUtterance=>',ele)
    debugger
}
fun_to_native(window.SpeechSynthesisUtterance)

window.SVGGraphicsElement=function SVGGraphicsElement(ele){
    xuxu_log('SVGGraphicsElement=>',ele)
    debugger
}
fun_to_native(window.SVGGraphicsElement)

window.BeforeInstallPromptEvent=function BeforeInstallPromptEvent(ele){
    xuxu_log('BeforeInstallPromptEvent=>',ele)
    debugger
}
fun_to_native(window.BeforeInstallPromptEvent)


window.HTMLFrameSetElement=function HTMLFrameSetElement(){
    xuxu_log('HTMLFrameSetElement=>')
    debugger
}
fun_to_native(window.HTMLFrameSetElement)

hasPointerCapture=function hasPointerCapture(val){
    debugger
}
fun_to_native(hasPointerCapture)
Object.defineProperty(HTMLFrameSetElement.prototype, 'hasPointerCapture', {
    value:hasPointerCapture,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete hasPointerCapture;

webkitRequestFullScreen=function webkitRequestFullScreen(){
    debugger
}
fun_to_native(webkitRequestFullScreen)
Object.defineProperty(HTMLFrameSetElement.prototype, 'webkitRequestFullScreen', {
    value:webkitRequestFullScreen,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete webkitRequestFullScreen;


window.SourceBuffer=function SourceBuffer(ele){
    xuxu_log('SourceBuffer=>',ele)
    debugger
}
fun_to_native(window.SourceBuffer)

changeType=function changeType(val){
    debugger
}
fun_to_native(changeType)
Object.defineProperty(SourceBuffer.prototype, 'changeType', {
    value:changeType,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete changeType;



window.matchMedia=function matchMedia(ele){
    xuxu_log('matchMedia=>',ele)
    var matches = 123
    if (ele === '(any-pointer: fine )'){
        matches = true
    }
    if (ele === '(any-pointer: coarse )'){
        matches = false
    }
    if (ele === '(any-pointer: none )'){
        matches = false
    }
    if (ele === '(any-pointer )'){
        matches = true
    }
    if (ele === '(any-hover: hover )'){
        matches = true
    }
    if (ele === '(any-hover: on-demand )'){
        matches = false
    }
    if (ele === '(any-hover: none )'){
        matches = false
    }
    if (ele === '(any-hover )'){
        matches = true
    }
    if (ele === '(color-gamut: srgb )'){
        matches = true
    }
    if (ele === '(color-gamut: p3 )'){
        matches = false
    }
    if (ele === '(color-gamut: rec2020 )'){
        matches = false
    }
    if (ele === '(color-gamut )'){
        matches = true
    }
    if(ele==='(any-pointer: coarse)'){
        matches = false
    }
    if(ele==='(any-pointer: fine)'){
        matches = true
    }
    if (matches===123){
        debugger
        xuxuxuxulog('matchmediaobj漏掉了=>', ele)
    }
    var matchmediaobj = xuxuwatch({
        matches: matches,
        media: ele,
        onchange: null,
    }, 'matchmediaobj')
    return matchmediaobj
}
fun_to_native(window.matchMedia)


window.PerformancePaintTiming=function PerformancePaintTiming(ele){
    xuxu_log('PerformancePaintTiming=>',ele)
    debugger
}
fun_to_native(window.PerformancePaintTiming)

window.OffscreenCanvas=function OffscreenCanvas(width, height){
    xuxu_log('OffscreenCanvas=>', width, height)
    if (width===1&&height===1){
        var offscreencanvas = xuxuwatch({
            height: height,
            oncontextlost: null,
            oncontextrestored: null,
            width: width,
            getContext:function getContext(val){
                xuxu_log('offscreencanvas=>', val)
                if (val === 'webgl'){
                    var webgl = xuxuwatch({
                        getExtension:function getExtension(val){
                            if (val === "WEBGL_debug_renderer_info"){
                                var wegl_info_obj = xuxuwatch({
                                    [Symbol.toStringTag]:"WebGLDebugRendererInfo",
                                    UNMASKED_RENDERER_WEBGL: 37446,
                                    UNMASKED_VENDOR_WEBGL: 37445,
                                }, 'wegl_info_obj');
                                return wegl_info_obj
                            }
                            debugger
                        },
                        getParameter:function getParameter(val){
                            if (val === 37445){
                                return "Google Inc. (NVIDIA)"
                            }
                            if (val === 37446){
                                return "ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti (0x00001380) Direct3D11 vs_5_0 ps_5_0, D3D11)"
                            }
                            debugger
                        },
                    }, 'webgl')
                    return webgl
                }
                debugger
            },
        }, 'offscreencanvas');
        fun_to_native(offscreencanvas.getContext)
        return  offscreencanvas
    }
    debugger
}
fun_to_native(OffscreenCanvas)


window.OffscreenCanvasRenderingContext2D=function OffscreenCanvasRenderingContext2D(ele){
    xuxu_log('OffscreenCanvasRenderingContext2D=>',ele)
    debugger
}
fun_to_native(window.OffscreenCanvasRenderingContext2D)

window.CloseEvent=function CloseEvent(ele){
    xuxu_log('CloseEvent=>',ele)
    debugger
}
fun_to_native(window.CloseEvent)



disconnect=function(){
    xuxu_log('disconnect',arguments)
}
fun_to_native(disconnect)


observe=function(){
    xuxu_log('observe',arguments)
}
fun_to_native(observe)

takeRecords=function(){
    xuxu_log('takeRecords',arguments)
}
fun_to_native(takeRecords)

window.MutationObserver=function MutationObserver(ele){
    xuxu_log('window.MutationObserver=>',ele)
    window.funserver = ele;
    var callback = xuxuwatch({
        disconnect:disconnect,
        observe:observe,
        takeRecords:takeRecords,
    }, 'callback')
    return callback
}
fun_to_native(window.MutationObserver)

window.CustomElementRegistry=function CustomElementRegistry(){
    debugger
}
fun_to_native(CustomElementRegistry)

window.innerWidth=500;
window.innerHeight=730;

window.outerWidth=1536;
window.outerHeight=816;

window.pageXOffset=0;
window.pageYOffset=0;

window.scrollX=0;
window.scrollY=0;

window.screenX=0;
window.screenY=0;

window.devicePixelRatio=1.25;

window.screenLeft=0;
window.screenTop=0;

window.name='&$_YWTU=_ObD7S0iUpwSswrv9SLPLh47fdDsR8NosQve4mz-Cx7&$_YVTX=Wq&vdFm='

window.length = 0;
window.closed=false;
window.credentialless=false;
window.onmessage=null;
window.opener=null;
window.frameElement=null;


window.onerror=null;
window.customElements=xuxuwatch({},'customElements')
window.menubar=xuxuwatch({
    visible:true
},'menubar')
window.personalbar=xuxuwatch({
    visible:true
},'personalbar')
window.scrollbars=xuxuwatch({
    visible:true
},'scrollbars')
window.statusbar=xuxuwatch({
    visible:true
},'statusbar')
window.toolbar=xuxuwatch({
    visible:true
},'toolbar')
window.locationbar=xuxuwatch({
    visible: true
},'locationbar')



window.origin = 'https://ganghang.gdtspace.com'
window.external=xuxuwatch({
    [Symbol.toStringTag]:'External',
    IsSearchProviderInstalled:function IsSearchProviderInstalled(){
        debugger
    }
},'external')
fun_to_native(window.external.IsSearchProviderInstalled)

window.trustedTypes=xuxuwatch({},'trustedTypes')
window.crossOriginIsolated=false
window.scheduler=xuxuwatch({},'scheduler')
window.caches=xuxuwatch({},'caches')
window.cookieStore=xuxuwatch({},'cookieStore')
window.documentPictureInPicture=xuxuwatch({},'documentPictureInPicture')


window.styleMedia=xuxuwatch({
    type:"screen"
},'styleMedia')
window.onsearch=null;
window.isSecureContext=true;
window.visualViewport=xuxuwatch({
    height: 729.5999755859375,
    offsetLeft: 0,
    offsetTop: 0,
    onresize: null,
    onscroll: null,
    onscrollend: null,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    width: 568,
},'visualViewport')


webkitRequestFileSystem=function webkitRequestFileSystem(type, size, successCallback){
    if (arguments.length<3){
        throw new TypeError("Failed to execute 'webkitRequestFileSystem' on 'Window': 3 arguments required, but only 0 present.");
    }
    xuxu_log('webkitRequestFileSystem=>',arguments)
    var Entry= {}
    Object.defineProperty(Entry, Symbol.toStringTag, {
        value: 'Entry',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    var DirectoryEntry={}
    Object.defineProperty(DirectoryEntry, Symbol.toStringTag, {
        value: 'DirectoryEntry',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    DirectoryEntry.__proto__=Entry;

    var DOMFileSystem={};
    var root={
        filesystem:DOMFileSystem,
        fullPath:"/",
        isDirectory:true,
        isFile:false,
        name:""
    };
    root.__proto__=DirectoryEntry;
    Object.defineProperty(DOMFileSystem, Symbol.toStringTag, {
        value: 'DOMFileSystem',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    Object.defineProperty(DOMFileSystem, 'name', {
        value: "https_ganghang.gdtspace.com_0:Temporary",
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    Object.defineProperty(DOMFileSystem, 'root', {
        value: root,
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    var fsfs=xuxuwatch({
        name: "https_ganghang.gdtspace.com_0:Temporary",
        root: root
    }, 'fsfs');
    fsfs.__proto__=DOMFileSystem;
    try {
        arguments[2](fsfs)
    }catch(e){
        arguments[3](fsfs)
    }
}
fun_to_native(webkitRequestFileSystem)

window.open=function open(ele){
    debugger
    xuxu_log('window.open=>',ele)
    return window
}
fun_to_native(window.open)

window.prompt=function prompt(ele){
    xuxu_log('window.prompt=>',ele)
    debugger
}
fun_to_native(window.prompt)

window.chrome = xuxuwatch({
    app:xuxuwatch({
            "isInstalled": false,
            "InstallState": {
                "DISABLED": "disabled",
                "INSTALLED": "installed",
                "NOT_INSTALLED": "not_installed"
            },
            "RunningState": {
                "CANNOT_RUN": "cannot_run",
                "READY_TO_RUN": "ready_to_run",
                "RUNNING": "running"
            }
        },'chrome.app'),
    csi:function(){
        debugger
    },
    loadTimes:function(){
        debugger
    },
}, 'chrome')

fun_to_native(clearInterval)

const _setTimeout = window.setTimeout;
const _setInterval = window.setInterval;
const _clearTimeout = window.clearTimeout;
const _clearInterval = window.clearInterval;

const timers = new Set();

setTimeoutindex=1;
window.setTimeout = function setTimeout(fn, time, ...args) {
    setTimeoutindex++;
    const id = _setTimeout(fn, time, ...args);
    timers.add(id);
    return setTimeoutindex;
};
fun_to_native(setTimeout)

setIntervalindex=1;
window.setInterval = function setInterval(fn, time, ...args) {
    setIntervalindex++;
    // if (time === 3000){
    //     return setIntervalindex;
    // }
    const id = _setInterval(fn, 0, ...args);
    timers.add(id);
    return setIntervalindex;
};
fun_to_native(setInterval)

window.clearAllTimers = function clearAllTimers() {
    for (const id of timers) {
        _clearTimeout(id);
        _clearInterval(id);
    }
    timers.clear();
    window.setTimeout = function() {};
    window.setInterval = function() {};
};



Node=function Node(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}   //不能new
Object.setPrototypeOf(Node, EventTarget);
Object.setPrototypeOf(Node.prototype, EventTarget.prototype)
Node.prototype.ATTRIBUTE_NODE=2
Object.defineProperty(Node.prototype, Symbol.toStringTag, {
    value: 'Node',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
insertBefore=function insertBefore(val){
    if(val==undefined){
        throw new Error("Failed to execute'removeChild' on 'Node': 1 argument required, but only 0 present.")
    }
    xuxu_log('Node.insertBefore=>',val)
    return val
}
fun_to_native(insertBefore)
Object.defineProperty(Node.prototype, 'insertBefore', {
    value: insertBefore,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
appendChild=function appendChild(val){
    if(val==undefined){
        throw new Error("Failed to execute 'appendChild' on 'Node': 1 argument required, but only 0 present.")
    }
    this[this.i]=val
    this.i++
    if(val.name=='action'){
        this.action=val
    }
    if(val.name=='textContent'){
        this.textContent=val
    }
    if(val.name=='id'){
        this.id=val
        this.innerText=val
    }
    if (val.id === '__Zm9ybS5pZAo__'){
        xuxu_log('document.appendChild添加form元素成功')
        Object.defineProperty(window.__proto__.__proto__, val.id, {
            configurable:true,
            enumerable: false,
            get:function(){
                if (val.del){
                    return val
                }
            }
        });
    }
    if (this === document.body){
        const all_len = document.all.length
        document.all[all_len] = val
        if (val.id){
            xuxu_log(val.id)
            document.all[val.id] = val
        }
        Object.defineProperty(document.all, all_len, {
            value: document.all[all_len],
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        document.body.childElementCount+=1
        document.all.length+=1
        val.parentNode=this;
    }
    if (this === document.head){
        val.parentNode=this;
    }
    xuxu_log('document.appendChild=>',val)
    return val
}
fun_to_native(appendChild)
Object.defineProperty(Node.prototype, 'appendChild', {
    value: appendChild,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
removeChild=function removeChild(val){
    if(val==undefined){
        throw new Error("Failed to execute'removeChild' on 'Node': 1 argument required, but only 0 present.")
    }
    if (val.id === '__Zm9ybS5pZAo__'){
        val.del = false
    }
    xuxu_log('removeChild=>',val)
    return val
}
fun_to_native(removeChild)
Object.defineProperty(Node.prototype, 'removeChild', {
    value: removeChild,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Node)




Document=function Document(){}  //能new
Object.setPrototypeOf(Document, Node);
Object.setPrototypeOf(Document.prototype, Node.prototype);
Object.defineProperty(Document.prototype, Symbol.toStringTag, {
    value: 'Document',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

getURL=function URL(){
    return 'https://ganghang.gdtspace.com/ContainerQuery'
}
getURL[syString]='function get URL() { [native code] }'
getURL.prototype=undefined;
Object.defineProperty(Document.prototype, 'URL', {
    get:getURL,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getURL;

getbaseURL=function baseURL(){
    return 'https://ganghang.gdtspace.com/'
}
getbaseURL[syString]='function get baseURL() { [native code] }'
getbaseURL.prototype=undefined;
Object.defineProperty(Document.prototype, 'baseURL', {
    get:getbaseURL,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getbaseURL;

getreadyState=function readyState(){
    return 'complete'
}
getreadyState[syString]='function get readyState() { [native code] }'
getreadyState.prototype=undefined;
Object.defineProperty(Document.prototype,'readyState', {
    get:getreadyState,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getreadyState;


createAttribute=function createAttribute(val) {
    xuxu_log('document.createAttribute=>',val)
    if (val === "TouchEvent") {
        throw new Error(`Failed to execute 'createAttribute' on 'Document': The provided event type ('${val}') is invalid.`);
    }
    debugger
}
fun_to_native(createAttribute)
Object.defineProperty(Document.prototype, 'createAttribute', {
    value: createAttribute,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


XPathExpression=function XPathExpression(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(XPathExpression.prototype, Symbol.toStringTag, {
    value: 'XPathExpression',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
evaluate=function(val){
    xuxu_log('evaluate=>',val)
    return ""
}
fun_to_native(evaluate)
Object.defineProperty(XPathExpression.prototype, 'evaluate', {
    value: evaluate,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(XPathExpression)

createExpression=function createExpression(val) {
    xuxu_log('document.createExpression=>',val)
    if(val=='//html'){
        var htmlobj = xuxuwatch({}, 'htmlobj')
        htmlobj.__proto__=XPathExpression.prototype
        return htmlobj
    }
}
fun_to_native(createExpression)
Object.defineProperty(Document.prototype, 'createExpression', {
    value: createExpression,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


createMockSpan=function createMockSpan() {
    const span = {
        i: 0,
        style: xuxuwatch({}, 'span.style'),
        innerHTML: '',
        nodeName: 'SPAN',
        _fontKey: 'mmllii',
        get offsetWidth() {
            var kd = span_style[this._fontKey]['width'];
            return kd
        },
        get offsetHeight() {
            var gd = span_style[this._fontKey]['height'];
            return gd
        }
    };
    Object.defineProperty(span.style, 'fontFamily', {
        set(val) {
            span._fontKey = val || '';
        },
        get() {
            return span._fontKey;
        }
    });
    span.style.__proto__=CSSStyleDeclaration.prototype;
    Object.setPrototypeOf(span, HTMLSpanElement.prototype);
    return span;
}


iframenavigator=xuxuwatch({
    [Symbol.toStringTag]:'Navigator',
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0",
    product: 'Gecko',
    productSub: '20030107',
    language: "zh-CN",
    platform:'Win32',
    maxTouchPoints:0,
    hardwareConcurrency:8,
    languages:["zh-CN"],
    webdriver:false,
    userAgentData:xuxuwatch({
        mobile:false,
    }, 'iframenavigator.userAgentData')
}, "iframenavigator")

iframedocument=xuxuwatch({
    location:xuxuwatch({
        "ancestorOrigins": {
            "0": "https://ganghang.gdtspace.com"
        },
        "href": "about:blank",
        "origin": "null",
        "protocol": "about:",
        "host": "",
        "hostname": "",
        "port": "",
        "pathname": "blank",
        "search": "",
        "hash": ""
    }, 'iframedocument.location'),
    cookie:'',
    referrer:'https://ganghang.gdtspace.com/ContainerQuery',
    title:'',
    readyState:'complete'
}, 'iframedocument')

iframedecodeURI=function decodeURI(val){
    debugger
}
fun_to_native(iframedecodeURI)

iframecontentWindow=xuxuwatch({
    decodeURI:iframedecodeURI,
    console:console,
    Error:Error,
    outerHeight:window.outerHeight,
    outerWidth:window.outerWidth,
    navigator:iframenavigator,
    document:iframedocument,
    postMessage:function postMessage(msg){
        xuxu_log('iframecontentWindow.postMessage=>', msg)
        if (msg===navigator.plugins){
            throw new TypeError("Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': PluginArray object could not be cloned.")
        }
        if (msg===navigator.plugins[0]){
            throw new TypeError("Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': Plugin object could not be cloned.")
        }
        if (msg===navigator.mimeTypes){
            throw new TypeError("Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': MimeTypeArray object could not be cloned.")
        }
        if (msg===navigator.mimeTypes[0]){
            throw new TypeError("Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': MimeType object could not be cloned.")
        }
        debugger
    },
    addEventListener:function addEventListener(eventType, fun){
        xuxu_log('iframecontentWindow.addEventListener=>', eventType)
        debugger
    }
}, 'iframecontentWindow')


createElement=function createElement(val) {
    if(val==undefined){
        throw new Error("Failed to execute 'createElement' on 'Document': 1 argument required, but only 0 present.")
    }
    xuxu_log('document.createElement=>',val)
    if (val === 'div') {
        var span = xuxuwatch(createMockSpan(), 'span')
        var children=[
            span,
        ]
        Object.setPrototypeOf(children, HTMLCollection.prototype);
        var divstyle = xuxuwatch({}, 'divstyle');
        var div = xuxuwatch({innerHTML:'',i:0, style:divstyle, children:children, id:''},'div');
        Object.setPrototypeOf(div, HTMLDivElement.prototype);
        xuxu_log('创建了div标签',div)
        return div
    }
    if (val === 'a') {
        var a=xuxuwatch({
            href_href:''
        }, 'a');
        Object.setPrototypeOf(a, HTMLAnchorElement.prototype);
        xuxu_log('创建了a标签',a)
        return a
    }
    if (val === 'form') {
        var form=xuxuwatch({innerHTML:'', i:0, del:true, name:'', tagName:'FORM'}, 'form')
        Object.setPrototypeOf(form, HTMLFormElement.prototype);
        xuxu_log('创建form标签',form)
        return form
    }
    if (val === 'input') {
        var input=xuxuwatch({innerHTML:'',i:0}, 'input');
        Object.setPrototypeOf(input, HTMLInputElement.prototype);
        xuxu_log('创建input标签',input)
        return input
    }
    if (val === 'canvas'){
        var canvas=xuxuwatch({innerHTML:'', i:0, name:'', tagName:'CANVAS'}, 'canvas')
        Object.setPrototypeOf(canvas, HTMLCanvasElement.prototype);
        xuxu_log('创建canvas标签',canvas)
        return canvas
    }
    if (val === 'audio'){
        var audio = xuxuwatch({innerHTML:'',i:0,tagName:'audio'}, 'audio');
        Object.setPrototypeOf(audio, HTMLAudioElement.prototype);
        xuxu_log('创建了audio标签',audio)
        return audio
    }
    if (val == 'video'){
        var video = xuxuwatch({innerHTML:'',i:0,tagName:'video'}, 'video');
        Object.setPrototypeOf(video, HTMLVideoElement.prototype);
        xuxu_log('创建了video标签',video)
        return video 
    }
    if (val === 'script'){
        var script = xuxuwatch({innerHTML:'',i:0,tagName:'SCRIPT'}, 'script');
        Object.setPrototypeOf(script, HTMLScriptElement.prototype);
        xuxu_log('创建了script标签',script)
        return script
    }
    if (val === 'iframe'){
        var iframe = xuxuwatch({
            style:xuxuwatch({}, 'iframe.style'),
            innerHTML: '',
            i: 0,
            tagName: 'IFRAME',
            name: '',
            contentWindow:iframecontentWindow,
        }, 'iframe');
        Object.setPrototypeOf(iframe, HTMLIFrameElement.prototype);
        xuxu_log('创建了iframe标签', iframe)
        return iframe
    }
    debugger
    xuxu_log('document.createElement=>漏掉了',val)
}
fun_to_native(createElement)
Object.defineProperty(Document.prototype, 'createElement', {
    value: createElement,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


createElementNS=function createElementNS(val) {
    xuxu_log('document.createElementNS=>',val)
    if (val === "TouchEvent") {
        throw new Error(`Failed to execute 'createElementNS' on 'Document': The provided event type ('${val}') is invalid.`);
    }
    debugger
}
fun_to_native(createElementNS)
Object.defineProperty(Document.prototype, 'createElementNS', {
    value: createElementNS,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

getElementsByTagName=function getElementsByTagName(val) {
    var docuall=[]
    Object.setPrototypeOf(docuall, HTMLCollection.prototype);
    let i=0
    let j=0
    while(1){
        if(document.all[i]==undefined){
            break
        }
        if(document.all[i].tagName.toLowerCase()==val.toLowerCase()){
            docuall[j]=document.all[i]
            j++
        }
        i++
    }
    xuxu_log('document.getElementsByTagName=>',val,docuall)
    return docuall
}
fun_to_native(getElementsByTagName)
Object.defineProperty(Document.prototype, 'getElementsByTagName', {
    value: getElementsByTagName,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getElementById=function getElementById(val) {
    xuxu_log('document.getElementById=>',val)
    if(val==undefined){
        throw new Error("Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.")
    }
    if (val === 'k5ylogNx1ksA'){
        return meta1
    }
    if (val === 'root-hammerhead-shadow-ui'){
        return null
    }
    if (val === '__anchor__'){
        return null
    }
    debugger
}
fun_to_native(getElementById)
Object.defineProperty(Document.prototype, 'getElementById', {
    value: getElementById,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

createEvent=function createEvent(val) {
    xuxu_log('document.createEvent=>',val)
    if (val === "TouchEvent") {
        throw new Error(`Failed to execute 'createEvent' on 'Document': The provided event type ('${val}') is invalid.`);
    }
}
fun_to_native(createEvent)
Object.defineProperty(Document.prototype, 'createEvent', {
    value: createEvent,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Document)


Element=function Element(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
// Element.prototype=xuxuwatch(Element.prototype, `方法原型:Element.prototype`)
// Element=xuxuwatch(Element, 'Element')
Object.setPrototypeOf(Element, Node);
Object.setPrototypeOf(Element.prototype, Node.prototype);
Object.defineProperty(Element.prototype, Symbol.toStringTag, {
    value: 'Element',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Element.prototype, Symbol.unscopables, {
    value: {
        after:true,
        append:true,
        before:true,
        prepend:true,
        remove:true,
        replaceChildren:true,
        replaceWith:true,
        slot:true
    },
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getAttribute=function getAttribute(val){
    if(val==undefined){
        throw new Error("Failed to execute 'getAttribute' on 'Element': 1 argument required, but only 0 present.")
    }
    xuxu_log('getAttribute=>',val,this[val]);
    if (val==='href'){
        xuxu_log('getAttribute=>', 'base返回了/')
        return '/'
    }
    if (this[val] === undefined){
        return null
    }
    return this[val]
}
fun_to_native(getAttribute)
Object.defineProperty(Element.prototype, 'getAttribute', {
    value: getAttribute,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

setAttribute=function setAttribute(key,val){
    if(val==undefined){
        throw new Error("Failed to execute 'setAttribute' on 'Element': 1 argument required, but only 0 present.")
    }
    xuxu_log('setAttribute=>',key,val)
    this[key] = val
}
fun_to_native(setAttribute)
Object.defineProperty(Element.prototype, 'setAttribute', {
    value: setAttribute,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getElementsByTagName = function getElementsByTagName(val) {
    var docuall=[]
    docuall.__proto__=HTMLCollection.prototype
    let i=0
    let j=0
    while(1){
        if(document.all[i]==undefined){
            break
        }
        if(document.all[i].tagName.toLowerCase()==val.toLowerCase()){
            docuall[j]=document.all[i]
            j++
        }
        i++
    }
    xuxu_log('document.getElementsByTagName=>',val,docuall)
    return docuall
}
fun_to_native(getElementsByTagName)
Object.defineProperty(Element.prototype, 'getElementsByTagName', {
    value: getElementsByTagName,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Element);




// 所有标签的父亲
HTMLElement=function HTMLElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLElement, Element);
Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
Object.defineProperty(HTMLElement.prototype, Symbol.toStringTag, {
  value: 'HTMLElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLElement)


// form标签
HTMLFormElement=function HTMLFormElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {

}
}
Object.setPrototypeOf(HTMLFormElement, HTMLElement);
Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLFormElement.prototype, Symbol.toStringTag, {
  value: 'HTMLFormElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLFormElement)



// p标签
HTMLParagraphElement=function HTMLParagraphElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLParagraphElement, HTMLElement);
Object.setPrototypeOf(HTMLParagraphElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLParagraphElement.prototype, Symbol.toStringTag, {
  value: 'HTMLParagraphElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLParagraphElement)


// html标签
HTMLHtmlElement=function HTMLHtmlElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLHtmlElement, HTMLElement);
Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLHtmlElement.prototype, Symbol.toStringTag, {
  value: 'HTMLHtmlElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLHtmlElement)


// base标签
HTMLBaseElement=function HTMLBaseElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLBaseElement, HTMLElement);
Object.setPrototypeOf(HTMLBaseElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLBaseElement.prototype, Symbol.toStringTag, {
  value: 'HTMLBaseElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLBaseElement)


// input标签
HTMLInputElement=function HTMLInputElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLInputElement, HTMLElement);
Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);

Object.defineProperty(HTMLInputElement.prototype, Symbol.toStringTag, {
  value: 'HTMLInputElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLInputElement)




// div标签
HTMLDivElement=function HTMLDivElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLDivElement, HTMLElement);
Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLDivElement.prototype, Symbol.toStringTag, {
  value: 'HTMLDivElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLDivElement)




// span标签
HTMLSpanElement=function HTMLSpanElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLSpanElement, HTMLElement);
Object.setPrototypeOf(HTMLSpanElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLSpanElement.prototype, Symbol.toStringTag, {
  value: 'HTMLSpanElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLSpanElement)



// head标签
HTMLHeadElement=function HTMLHeadElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLHeadElement, HTMLElement);
Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLHeadElement.prototype, Symbol.toStringTag, {
  value: 'HTMLHeadElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLHeadElement)


// meta标签
HTMLMetaElement=function HTMLMetaElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLMetaElement, HTMLElement);
Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLMetaElement.prototype, Symbol.toStringTag, {
  value: 'HTMLMetaElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLMetaElement)


// script标签
HTMLScriptElement=function HTMLScriptElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
Object.setPrototypeOf(HTMLScriptElement, HTMLElement);
Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLScriptElement.prototype, Symbol.toStringTag, {
  value: 'HTMLScriptElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLScriptElement)




// a标签
HTMLAnchorElement=function HTMLAnchorElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
HTMLAnchorElement.prototype = {
    set href(val) {
        this.href_href = val;
        try {
            this._url = new URL(val, location.href);
        } catch {
            this._url = null;
        }
    },
    get href() {
        return this._url ? this._url.href : '';
    },
    get protocol() {
        return this._url ? this._url.protocol : '';
    },
    get hostname() {
        return this._url ? this._url.hostname : '';
    },
    get port() {
        return this._url ? this._url.port || '' : '';
    },
    get pathname() {
        return this._url ? this._url.pathname : '';
    },
    get hash() {
        return this._url ? this._url.hash : '';
    },
    get search() {
        return this._url ? this._url.search : '';
    }
};
Object.setPrototypeOf(HTMLAnchorElement, HTMLElement);
Object.setPrototypeOf(HTMLAnchorElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLAnchorElement.prototype, Symbol.toStringTag, {
  value: 'HTMLAnchorElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLAnchorElement)


values=function values(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(values)
item=function item(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(item)
namedItem=function namedItem(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(namedItem)

// all标签
HTMLAllCollection=function HTMLAllCollection(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(HTMLAllCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLAllCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, Symbol.iterator, {
    value: values,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLAllCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'item', {
    value: item,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'length', {
    value: 10,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'namedItem', {
    value: namedItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLAllCollection)




WebGLRenderingContext=function WebGLRenderingContext(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    } else {}
}  //不能new
fun_to_native(WebGLRenderingContext)

Object.defineProperty(WebGLRenderingContext.prototype, Symbol.toStringTag, {
    value: 'WebGLRenderingContext',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGLRenderingContext.prototype, 'drawingBufferColorSpace', {
    value: 'srgb',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

Object.defineProperty(WebGLRenderingContext.prototype, 'drawingBufferFormat', {
    value: 32856,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGLRenderingContext.prototype, 'drawingBufferHeight', {
    value: 150,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGLRenderingContext.prototype, 'drawingBufferWidth', {
    value: 300,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getParameter=function getParameter(ele){
    xuxu_log('WebGLRenderingContext.getParameter=>',ele)
    if (ele == 37445){
        return "Google Inc. (NVIDIA)"
    }
    if (ele == 37446){
        return "ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti (0x00001380) Direct3D11 vs_5_0 ps_5_0, D3D11)"
    }
}
fun_to_native(getParameter)
Object.defineProperty(WebGLRenderingContext.prototype, 'getParameter', {
    value: getParameter,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

createBuffer=function createBuffer(ele){
    xuxu_log('WebGLRenderingContext.createBuffer=>',ele)
    var webglbuffer = xuxuwatch({}, 'webglbuffer')
    return webglbuffer
}
fun_to_native(createBuffer)
Object.defineProperty(WebGLRenderingContext.prototype, 'createBuffer', {
    value: createBuffer,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

getShaderPrecisionFormat=function getShaderPrecisionFormat(shaderType, precisionType){
    xuxu_log('WebGLRenderingContext.getShaderPrecisionFormat=>',shaderType, precisionType)
    if (shaderType===35633 && precisionType===36338){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35633 && precisionType===36337){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35633 && precisionType===36336){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35633 && precisionType===36341){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35633 && precisionType===36340){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35633 && precisionType===36339){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36338){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36337){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36336){
        var getformat=xuxuwatch({
            precision: 23,
            rangeMax: 127,
            rangeMin: 127,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36341){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36340){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    if (shaderType===35632 && precisionType===36339){
        var getformat=xuxuwatch({
            precision: 0,
            rangeMax: 30,
            rangeMin: 31,
        }, 'getformat')
        return getformat
    }
    console.log('WebGLRenderingContext.getShaderPrecisionFormat=>',shaderType, precisionType);
    debugger;
}
fun_to_native(getShaderPrecisionFormat)
Object.defineProperty(WebGLRenderingContext.prototype, 'getShaderPrecisionFormat', {
    value: getShaderPrecisionFormat,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

bindBuffer=function bindBuffer(ele){
    xuxu_log('WebGLRenderingContext.bindBuffer=>',arguments)
}
fun_to_native(bindBuffer)
Object.defineProperty(WebGLRenderingContext.prototype, 'bindBuffer', {
    value: bindBuffer,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

bufferData=function bufferData(ele){
    xuxu_log('WebGLRenderingContext.bufferData=>',arguments)
}
fun_to_native(bufferData)
Object.defineProperty(WebGLRenderingContext.prototype, 'bufferData', {
    value: bufferData,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


createProgram=function createProgram(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.createProgram=>',arguments)
    var createprogramobj = xuxuwatch({},'createprogramobj')
    return createprogramobj
}
fun_to_native(createProgram)
Object.defineProperty(WebGLRenderingContext.prototype, 'createProgram', {
    value: createProgram,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

createShader=function createShader(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.createShader=>',arguments)
    var createshaderobj = xuxuwatch({}, `createshaderobj.${ele}`)
    return createshaderobj
}
fun_to_native(createShader)
Object.defineProperty(WebGLRenderingContext.prototype, 'createShader', {
    value: createShader,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

shaderSource=function shaderSource(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.shaderSource=>',arguments)
}
fun_to_native(shaderSource)
Object.defineProperty(WebGLRenderingContext.prototype, 'shaderSource', {
    value: shaderSource,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

compileShader=function compileShader(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.compileShader=>',arguments)
}
fun_to_native(compileShader)
Object.defineProperty(WebGLRenderingContext.prototype, 'compileShader', {
    value: compileShader,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

attachShader=function attachShader(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.attachShader=>',arguments)
}
fun_to_native(attachShader)
Object.defineProperty(WebGLRenderingContext.prototype, 'attachShader', {
    value: attachShader,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

linkProgram=function linkProgram(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.linkProgram=>',arguments)
}
fun_to_native(linkProgram)
Object.defineProperty(WebGLRenderingContext.prototype, 'linkProgram', {
    value: linkProgram,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

useProgram=function useProgram(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.useProgram=>',arguments)
}
fun_to_native(useProgram)
Object.defineProperty(WebGLRenderingContext.prototype, 'useProgram', {
    value: useProgram,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


getAttribLocation=function getAttribLocation(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.getAttribLocation=>',arguments)
    return 0
}
fun_to_native(getAttribLocation)
Object.defineProperty(WebGLRenderingContext.prototype, 'getAttribLocation', {
    value: getAttribLocation,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


getUniformLocation=function getUniformLocation(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.getUniformLocation=>',arguments)
}
fun_to_native(getUniformLocation)
Object.defineProperty(WebGLRenderingContext.prototype, 'getUniformLocation', {
    value: getUniformLocation,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});


enableVertexAttribArray=function enableVertexAttribArray(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.enableVertexAttribArray=>',arguments)
}
fun_to_native(enableVertexAttribArray)
Object.defineProperty(WebGLRenderingContext.prototype, 'enableVertexAttribArray', {
    value: enableVertexAttribArray,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

vertexAttribPointer=function vertexAttribPointer(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.vertexAttribPointer=>',arguments)
}
fun_to_native(vertexAttribPointer)
Object.defineProperty(WebGLRenderingContext.prototype, 'vertexAttribPointer', {
    value: vertexAttribPointer,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

uniform2f=function uniform2f(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.uniform2f=>',arguments)
}
fun_to_native(uniform2f)
Object.defineProperty(WebGLRenderingContext.prototype, 'uniform2f', {
    value: uniform2f,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

drawArrays=function drawArrays(ele){
    // debugger
    xuxu_log('WebGLRenderingContext.drawArrays=>',arguments)
}
fun_to_native(drawArrays)
Object.defineProperty(WebGLRenderingContext.prototype, 'drawArrays', {
    value: drawArrays,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});



getSupportedExtensions=function getSupportedExtensions(ele){
    xuxu_log('WebGLRenderingContext.getSupportedExtensions=>',arguments)
    return ["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_clip_control","EXT_color_buffer_half_float","EXT_depth_clamp","EXT_disjoint_timer_query","EXT_float_blend","EXT_frag_depth","EXT_polygon_offset_clamp","EXT_shader_texture_lod","EXT_texture_compression_bptc","EXT_texture_compression_rgtc","EXT_texture_filter_anisotropic","EXT_texture_mirror_clamp_to_edge","EXT_sRGB","KHR_parallel_shader_compile","OES_element_index_uint","OES_fbo_render_mipmap","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_blend_func_extended","WEBGL_color_buffer_float","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_debug_renderer_info","WEBGL_debug_shaders","WEBGL_depth_texture","WEBGL_draw_buffers","WEBGL_lose_context","WEBGL_multi_draw","WEBGL_polygon_mode"]
}
fun_to_native(getSupportedExtensions)
Object.defineProperty(WebGLRenderingContext.prototype, 'getSupportedExtensions', {
    value: getSupportedExtensions,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});



getExtension=function getExtension(val){
    xuxu_log('WebGLRenderingContext.getExtension=>', val);
    if (val === "WEBGL_debug_renderer_info"){
        var wegl_info_obj = xuxuwatch({
            [Symbol.toStringTag]:"WebGLDebugRendererInfo",
            UNMASKED_RENDERER_WEBGL: 37446,
            UNMASKED_VENDOR_WEBGL: 37445,
        }, 'wegl_info_obj');
        return wegl_info_obj
    }
    if (val === "ANGLE_instanced_arrays"){
        var angle_info_obj = xuxuwatch({
            VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
            drawArraysInstancedANGLE:function drawArraysInstancedANGLE(a,b,c,d){
                debugger
            },
            drawElementsInstancedANGLE:function drawElementsInstancedANGLE(a,b,c,d,e){
                debugger
            },
            vertexAttribDivisorANGLE:function vertexAttribDivisorANGLE(a,b){
                debugger
            },
        }, 'angle_info_obj');
        Object.defineProperty(angle_info_obj, Symbol.toStringTag, {
            value: 'ANGLEInstancedArrays',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(angle_info_obj.drawArraysInstancedANGLE);
        fun_to_native(angle_info_obj.drawElementsInstancedANGLE);
        fun_to_native(angle_info_obj.vertexAttribDivisorANGLE);
        return angle_info_obj
    }
    if (val === 'EXT_blend_minmax'){
        var ext_blend_minmax_obj = xuxuwatch({
            MAX_EXT: 32776,
            MIN_EXT: 32775,
        }, 'ext_blend_minmax_obj');
        Object.defineProperty(ext_blend_minmax_obj, Symbol.toStringTag, {
            value: 'EXTBlendMinMax',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return ext_blend_minmax_obj
    }
    if (val === 'EXT_clip_control'){
        var ext_clip_control_obj = xuxuwatch({
            CLIP_DEPTH_MODE_EXT: 37725,
            CLIP_ORIGIN_EXT: 37724,
            LOWER_LEFT_EXT: 36001,
            NEGATIVE_ONE_TO_ONE_EXT: 37726,
            UPPER_LEFT_EXT: 36002,
            ZERO_TO_ONE_EXT: 37727,
            clipControlEXT:function clipControlEXT(a,b){
                debugger
            }
        }, 'ext_clip_control_obj');
        Object.defineProperty(ext_clip_control_obj, Symbol.toStringTag, {
            value: 'EXTClipControl',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return ext_clip_control_obj
    }
    if (val === 'EXT_color_buffer_half_float'){
        var ext_color_buffer_half_float_obj = xuxuwatch({
            FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
            RGB16F_EXT: 34843,
            RGBA16F_EXT: 34842,
            UNSIGNED_NORMALIZED_EXT: 35863,
        }, 'ext_color_buffer_half_float_obj');
        Object.defineProperty(ext_color_buffer_half_float_obj, Symbol.toStringTag, {
            value: 'EXTColorBufferHalfFloat',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return ext_color_buffer_half_float_obj
    }
    if (val === 'EXT_depth_clamp'){
        var EXT_depth_clamp = xuxuwatch({
            DEPTH_CLAMP_EXT:34383,
        }, 'EXT_depth_clamp');
        Object.defineProperty(EXT_depth_clamp, Symbol.toStringTag, {
            value: 'EXTDepthClamp',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_depth_clamp
    }
    if (val === 'EXT_disjoint_timer_query'){
        return null
    }
    if (val === 'EXT_float_blend'){
        var ext_float_blend_obj = xuxuwatch({}, 'ext_float_blend_obj');
        Object.defineProperty(ext_float_blend_obj, Symbol.toStringTag, {
            value: 'EXTFloatBlend',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return ext_float_blend_obj
    }
    if (val === 'EXT_frag_depth'){
        var EXT_frag_depth = xuxuwatch({}, 'EXT_frag_depth');
        Object.defineProperty(EXT_frag_depth, Symbol.toStringTag, {
            value: 'EXTFragDepth',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_frag_depth
    }
    if (val === 'EXT_polygon_offset_clamp'){
        var EXT_polygon_offset_clamp = xuxuwatch({
            POLYGON_OFFSET_CLAMP_EXT:36379,
            polygonOffsetClampEXT:function polygonOffsetClampEXT(a,b,c){
                debugger
            }
        }, 'EXT_polygon_offset_clamp');
        Object.defineProperty(EXT_polygon_offset_clamp, Symbol.toStringTag, {
            value: 'EXTPolygonOffsetClamp',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(EXT_polygon_offset_clamp.polygonOffsetClampEXT)
        return EXT_polygon_offset_clamp
    }
    if (val === 'EXT_shader_texture_lod'){
        var EXT_shader_texture_lod = xuxuwatch({}, 'EXT_shader_texture_lod');
        Object.defineProperty(EXT_shader_texture_lod, Symbol.toStringTag, {
            value: 'EXTShaderTextureLOD',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_shader_texture_lod
    }
    if (val === 'EXT_texture_compression_bptc'){
        var EXT_texture_compression_bptc = xuxuwatch({
            COMPRESSED_RGBA_BPTC_UNORM_EXT: 36492,
            COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT: 36494,
            COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT: 36495,
            COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: 36493,
        }, 'EXT_texture_compression_bptc');
        Object.defineProperty(EXT_texture_compression_bptc, Symbol.toStringTag, {
            value: 'EXTTextureCompressionBPTC',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_texture_compression_bptc
    }
    if (val === 'EXT_texture_compression_rgtc'){
        var EXT_texture_compression_rgtc = xuxuwatch({
            COMPRESSED_RED_GREEN_RGTC2_EXT: 36285,
            COMPRESSED_RED_RGTC1_EXT: 36283,
            COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 36286,
            COMPRESSED_SIGNED_RED_RGTC1_EXT: 36284,
        }, 'EXT_texture_compression_rgtc');
        Object.defineProperty(EXT_texture_compression_rgtc, Symbol.toStringTag, {
            value: 'EXTTextureCompressionRGTC',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_texture_compression_rgtc
    }
    if (val === 'EXT_texture_filter_anisotropic'){
        var EXT_texture_filter_anisotropic = xuxuwatch({
            MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047,
            TEXTURE_MAX_ANISOTROPY_EXT: 34046,
        }, 'EXT_texture_filter_anisotropic');
        Object.defineProperty(EXT_texture_filter_anisotropic, Symbol.toStringTag, {
            value: 'EXTTextureFilterAnisotropic',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_texture_filter_anisotropic
    }
    if (val === 'EXT_texture_mirror_clamp_to_edge'){
        var EXT_texture_mirror_clamp_to_edge = xuxuwatch({
            MIRROR_CLAMP_TO_EDGE_EXT: 34627
        }, 'EXT_texture_mirror_clamp_to_edge');
        Object.defineProperty(EXT_texture_mirror_clamp_to_edge, Symbol.toStringTag, {
            value: 'EXTTextureMirrorClampToEdge',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_texture_mirror_clamp_to_edge
    }
    if (val === 'EXT_sRGB'){
        var EXT_sRGB = xuxuwatch({
            FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 33296,
            SRGB8_ALPHA8_EXT: 35907,
            SRGB_ALPHA_EXT: 35906,
            SRGB_EXT: 35904,
        }, 'EXT_sRGB');
        Object.defineProperty(EXT_sRGB, Symbol.toStringTag, {
            value: 'EXTsRGB',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return EXT_sRGB
    }
    if (val === 'KHR_parallel_shader_compile'){
        return null
    }
    if (val === 'OES_element_index_uint'){
        var OES_element_index_uint = xuxuwatch({}, 'OES_element_index_uint');
        Object.defineProperty(OES_element_index_uint, Symbol.toStringTag, {
            value: 'OESElementIndexUint',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_element_index_uint
    }
    if (val === 'OES_fbo_render_mipmap'){
        var OES_fbo_render_mipmap = xuxuwatch({}, 'OES_fbo_render_mipmap');
        Object.defineProperty(OES_fbo_render_mipmap, Symbol.toStringTag, {
            value: 'OESFboRenderMipmap',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_fbo_render_mipmap
    }
    if (val === 'OES_standard_derivatives'){
        var OES_standard_derivatives = xuxuwatch({
            FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723
        }, 'OES_standard_derivatives');
        Object.defineProperty(OES_standard_derivatives, Symbol.toStringTag, {
            value: 'OESStandardDerivatives',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_standard_derivatives
    }
    if (val === 'OES_texture_float'){
        var OES_texture_float = xuxuwatch({}, 'OES_texture_float');
        Object.defineProperty(OES_texture_float, Symbol.toStringTag, {
            value: 'OESTextureFloat',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_texture_float
    }
    if (val === 'OES_texture_float_linear'){
        var OES_texture_float_linear = xuxuwatch({}, 'OES_texture_float_linear');
        Object.defineProperty(OES_texture_float_linear, Symbol.toStringTag, {
            value: 'OESTextureFloatLinear',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_texture_float_linear
    }
    if (val === 'OES_texture_half_float'){
        var OES_texture_half_float = xuxuwatch({
            HALF_FLOAT_OES: 36193
        }, 'OES_texture_half_float');
        Object.defineProperty(OES_texture_half_float, Symbol.toStringTag, {
            value: 'OESTextureHalfFloat',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_texture_half_float
    }
    if (val === 'OES_texture_half_float_linear'){
        var OES_texture_half_float_linear = xuxuwatch({}, 'OES_texture_half_float_linear');
        Object.defineProperty(OES_texture_half_float_linear, Symbol.toStringTag, {
            value: 'OESTextureHalfFloatLinear',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return OES_texture_half_float_linear
    }
    if (val === 'OES_vertex_array_object'){
        var OES_vertex_array_object = xuxuwatch({
            VERTEX_ARRAY_BINDING_OES: 34229,
            bindVertexArrayOES: function bindVertexArrayOES(){
                debugger
            },
            createVertexArrayOES: function createVertexArrayOES(){
                debugger
            },
            deleteVertexArrayOES: function deleteVertexArrayOES(){
                debugger
            },
            isVertexArrayOES: function isVertexArrayOES(){
                debugger
            }
        }, 'OES_vertex_array_object');
        Object.defineProperty(OES_vertex_array_object, Symbol.toStringTag, {
            value: 'OESTextureHalfFloatLinear',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(OES_vertex_array_object.bindVertexArrayOES);
        fun_to_native(OES_vertex_array_object.createVertexArrayOES);
        fun_to_native(OES_vertex_array_object.deleteVertexArrayOES);
        fun_to_native(OES_vertex_array_object.isVertexArrayOES);
        return OES_vertex_array_object
    }
    if (val === 'WEBGL_blend_func_extended'){
        return null
    }
    if (val === 'WEBGL_color_buffer_float'){
        var WEBGL_color_buffer_float = xuxuwatch({
            FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
            RGBA32F_EXT: 34836,
            UNSIGNED_NORMALIZED_EXT: 35863,
        }, 'WEBGL_color_buffer_float');
        Object.defineProperty(WEBGL_color_buffer_float, Symbol.toStringTag, {
            value: 'WebGLColorBufferFloat',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return WEBGL_color_buffer_float
    }
    if (val === 'WEBGL_compressed_texture_s3tc'){
        var WEBGL_compressed_texture_s3tc = xuxuwatch({
            COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
            COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
            COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
            COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
        }, 'WEBGL_compressed_texture_s3tc');
        Object.defineProperty(WEBGL_compressed_texture_s3tc, Symbol.toStringTag, {
            value: 'WebGLCompressedTextureS3TC',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return WEBGL_compressed_texture_s3tc
    }
    if (val === 'WEBGL_compressed_texture_s3tc_srgb'){
        var WEBGL_compressed_texture_s3tc_srgb = xuxuwatch({
            COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 35917,
            COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 35918,
            COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 35919,
            COMPRESSED_SRGB_S3TC_DXT1_EXT: 35916,
        }, 'WEBGL_compressed_texture_s3tc_srgb');
        Object.defineProperty(WEBGL_compressed_texture_s3tc_srgb, Symbol.toStringTag, {
            value: 'WebGLCompressedTextureS3TCsRGB',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return WEBGL_compressed_texture_s3tc_srgb
    }
    if (val === 'WEBGL_debug_shaders'){
        var WEBGL_debug_shaders = xuxuwatch({
            getTranslatedShaderSource:function getTranslatedShaderSource(){
                debugger
            }
        }, 'WEBGL_debug_shaders');
        Object.defineProperty(WEBGL_debug_shaders, Symbol.toStringTag, {
            value: 'WebGLDebugShaders',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(WEBGL_debug_shaders.getTranslatedShaderSource)
        return WEBGL_debug_shaders
    }
    if (val === 'WEBGL_depth_texture'){
        var WEBGL_depth_texture = xuxuwatch({
            UNSIGNED_INT_24_8_WEBGL: 34042
        }, 'WEBGL_depth_texture');
        Object.defineProperty(WEBGL_depth_texture, Symbol.toStringTag, {
            value: 'WebGLDepthTexture',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        return WEBGL_depth_texture
    }
    if (val === 'WEBGL_draw_buffers'){
        var WEBGL_draw_buffers = xuxuwatch({
            COLOR_ATTACHMENT0_WEBGL: 36064,
            COLOR_ATTACHMENT1_WEBGL: 36065,
            COLOR_ATTACHMENT2_WEBGL: 36066,
            COLOR_ATTACHMENT3_WEBGL: 36067,
            COLOR_ATTACHMENT4_WEBGL: 36068,
            COLOR_ATTACHMENT5_WEBGL: 36069,
            COLOR_ATTACHMENT6_WEBGL: 36070,
            COLOR_ATTACHMENT7_WEBGL: 36071,
            COLOR_ATTACHMENT8_WEBGL: 36072,
            COLOR_ATTACHMENT9_WEBGL: 36073,
            COLOR_ATTACHMENT10_WEBGL: 36074,
            COLOR_ATTACHMENT11_WEBGL: 36075,
            COLOR_ATTACHMENT12_WEBGL: 36076,
            COLOR_ATTACHMENT13_WEBGL: 36077,
            COLOR_ATTACHMENT14_WEBGL: 36078,
            COLOR_ATTACHMENT15_WEBGL: 36079,
            DRAW_BUFFER0_WEBGL: 34853,
            DRAW_BUFFER1_WEBGL: 34854,
            DRAW_BUFFER2_WEBGL: 34855,
            DRAW_BUFFER3_WEBGL: 34856,
            DRAW_BUFFER4_WEBGL: 34857,
            DRAW_BUFFER5_WEBGL: 34858,
            DRAW_BUFFER6_WEBGL: 34859,
            DRAW_BUFFER7_WEBGL: 34860,
            DRAW_BUFFER8_WEBGL: 34861,
            DRAW_BUFFER9_WEBGL: 34862,
            DRAW_BUFFER10_WEBGL: 34863,
            DRAW_BUFFER11_WEBGL: 34864,
            DRAW_BUFFER12_WEBGL: 34865,
            DRAW_BUFFER13_WEBGL: 34866,
            DRAW_BUFFER14_WEBGL: 34867,
            DRAW_BUFFER15_WEBGL: 34868,
            MAX_COLOR_ATTACHMENTS_WEBGL: 36063,
            MAX_DRAW_BUFFERS_WEBGL: 34852,
            drawBuffersWEBGL:function drawBuffersWEBGL(){
                debugger
            },
        }, 'WEBGL_draw_buffers');
        Object.defineProperty(WEBGL_draw_buffers, Symbol.toStringTag, {
            value: 'WebGLDrawBuffers',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(WEBGL_draw_buffers.drawBuffersWEBGL);
        return WEBGL_draw_buffers
    }
    if (val === 'WEBGL_lose_context'){
        var WEBGL_lose_context = xuxuwatch({
            loseContext:function loseContext(){
                debugger
            },
            restoreContext:function loseContext(){
                debugger
            },
        }, 'WEBGL_lose_context');
        Object.defineProperty(WEBGL_lose_context, Symbol.toStringTag, {
            value: 'WebGLLoseContext',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(WEBGL_lose_context.loseContext);
        fun_to_native(WEBGL_lose_context.restoreContext);
        return WEBGL_lose_context
    }
    if (val === 'WEBGL_multi_draw'){
        var WEBGL_multi_draw = xuxuwatch({
            multiDrawArraysInstancedWEBGL:function multiDrawArraysInstancedWEBGL(){
                debugger
            },
            multiDrawArraysWEBGL:function multiDrawArraysWEBGL(){
                debugger
            },
            multiDrawElementsInstancedWEBGL:function multiDrawElementsInstancedWEBGL(){
                debugger
            },
            multiDrawElementsWEBGL:function multiDrawElementsWEBGL(){
                debugger
            },
        }, 'WEBGL_multi_draw');
        Object.defineProperty(WEBGL_multi_draw, Symbol.toStringTag, {
            value: 'WebGLMultiDraw',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(WEBGL_multi_draw.multiDrawArraysInstancedWEBGL);
        fun_to_native(WEBGL_multi_draw.multiDrawArraysWEBGL);
        fun_to_native(WEBGL_multi_draw.multiDrawElementsInstancedWEBGL);
        fun_to_native(WEBGL_multi_draw.multiDrawElementsWEBGL);
        return WEBGL_multi_draw
    }
    if (val === 'WEBGL_polygon_mode'){
        var WEBGL_polygon_mode = xuxuwatch({
            FILL_WEBGL: 6914,
            LINE_WEBGL: 6913,
            POLYGON_MODE_WEBGL: 2880,
            POLYGON_OFFSET_LINE_WEBGL: 10754,
            polygonModeWEBGL: function polygonModeWEBGL(){
                debugger
            }
        }, 'WEBGL_polygon_mode');
        Object.defineProperty(WEBGL_polygon_mode, Symbol.toStringTag, {
            value: 'WebGLPolygonMode',
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
        fun_to_native(WEBGL_polygon_mode.polygonModeWEBGL);
        return WEBGL_polygon_mode
    }
    console.log('WebGLRenderingContext.getExtension=>', val)
    debugger
}
fun_to_native(getExtension)
Object.defineProperty(WebGLRenderingContext.prototype, 'getExtension', {
    value: getExtension,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getExtension;

const constants={ACTIVE_ATTRIBUTES:35721,ACTIVE_TEXTURE:34016,ACTIVE_UNIFORMS:35718,ACTIVE_UNIFORM_BLOCKS:35382,ALIASED_LINE_WIDTH_RANGE:33902,ALIASED_POINT_SIZE_RANGE:33901,ALPHA:6406,ALPHA_BITS:3413,ALREADY_SIGNALED:37146,ALWAYS:519,ANY_SAMPLES_PASSED:35887,ANY_SAMPLES_PASSED_CONSERVATIVE:36202,ARRAY_BUFFER:34962,ARRAY_BUFFER_BINDING:34964,ATTACHED_SHADERS:35717,BACK:1029,BLEND:3042,BLEND_COLOR:32773,BLEND_DST_ALPHA:32970,BLEND_DST_RGB:32968,BLEND_EQUATION:32777,BLEND_EQUATION_ALPHA:34877,BLEND_EQUATION_RGB:32777,BLEND_SRC_ALPHA:32971,BLEND_SRC_RGB:32969,BLUE_BITS:3412,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,BROWSER_DEFAULT_WEBGL:37444,BUFFER_SIZE:34660,BUFFER_USAGE:34661,BYTE:5120,CCW:2305,CLAMP_TO_EDGE:33071,COLOR:6144,COLOR_ATTACHMENT0:36064,COLOR_ATTACHMENT1:36065,COLOR_ATTACHMENT2:36066,COLOR_ATTACHMENT3:36067,COLOR_ATTACHMENT4:36068,COLOR_ATTACHMENT5:36069,COLOR_ATTACHMENT6:36070,COLOR_ATTACHMENT7:36071,COLOR_ATTACHMENT8:36072,COLOR_ATTACHMENT9:36073,COLOR_ATTACHMENT10:36074,COLOR_ATTACHMENT11:36075,COLOR_ATTACHMENT12:36076,COLOR_ATTACHMENT13:36077,COLOR_ATTACHMENT14:36078,COLOR_ATTACHMENT15:36079,COLOR_BUFFER_BIT:16384,COLOR_CLEAR_VALUE:3106,COLOR_WRITEMASK:3107,COMPARE_REF_TO_TEXTURE:34894,COMPILE_STATUS:35713,COMPRESSED_TEXTURE_FORMATS:34467,CONDITION_SATISFIED:37148,CONSTANT_ALPHA:32771,CONSTANT_COLOR:32769,CONTEXT_LOST_WEBGL:37442,COPY_READ_BUFFER:36662,COPY_READ_BUFFER_BINDING:36662,COPY_WRITE_BUFFER:36663,COPY_WRITE_BUFFER_BINDING:36663,CULL_FACE:2884,CULL_FACE_MODE:2885,CURRENT_PROGRAM:35725,CURRENT_QUERY:34917,CURRENT_VERTEX_ATTRIB:34342,CW:2304,DECR:7683,DECR_WRAP:34056,DELETE_STATUS:35712,DEPTH:6145,DEPTH24_STENCIL8:35056,DEPTH32F_STENCIL8:36013,DEPTH_ATTACHMENT:36096,DEPTH_BITS:3414,DEPTH_BUFFER_BIT:256,DEPTH_CLEAR_VALUE:2931,DEPTH_COMPONENT:6402,DEPTH_COMPONENT16:33189,DEPTH_COMPONENT24:33190,DEPTH_COMPONENT32F:36012,DEPTH_FUNC:2932,DEPTH_RANGE:2928,DEPTH_STENCIL:34041,DEPTH_STENCIL_ATTACHMENT:33306,DEPTH_TEST:2929,DEPTH_WRITEMASK:2930,DITHER:3024,DONT_CARE:4352,DRAW_BUFFER0:34853,DRAW_BUFFER1:34854,DRAW_BUFFER2:34855,DRAW_BUFFER3:34856,DRAW_BUFFER4:34857,DRAW_BUFFER5:34858,DRAW_BUFFER6:34859,DRAW_BUFFER7:34860,DRAW_BUFFER8:34861,DRAW_BUFFER9:34862,DRAW_BUFFER10:34863,DRAW_BUFFER11:34864,DRAW_BUFFER12:34865,DRAW_BUFFER13:34866,DRAW_BUFFER14:34867,DRAW_BUFFER15:34868,DRAW_FRAMEBUFFER:36009,DRAW_FRAMEBUFFER_BINDING:36006,DST_ALPHA:772,DST_COLOR:774,DYNAMIC_COPY:35050,DYNAMIC_DRAW:35048,DYNAMIC_READ:35049,ELEMENT_ARRAY_BUFFER:34963,ELEMENT_ARRAY_BUFFER_BINDING:34965,EQUAL:514,FASTEST:4353,FLOAT:5126,FLOAT_32_UNSIGNED_INT_24_8_REV:36269,FLOAT_MAT2:35674,FLOAT_MAT2x3:35685,FLOAT_MAT2x4:35686,FLOAT_MAT3:35675,FLOAT_MAT3x2:35687,FLOAT_MAT3x4:35688,FLOAT_MAT4:35676,FLOAT_MAT4x2:35689,FLOAT_MAT4x3:35690,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,FRAGMENT_SHADER:35632,FRAGMENT_SHADER_DERIVATIVE_HINT:35723,FRAMEBUFFER:36160,FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE:33301,FRAMEBUFFER_ATTACHMENT_BLUE_SIZE:33300,FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:33296,FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE:33297,FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE:33302,FRAMEBUFFER_ATTACHMENT_GREEN_SIZE:33299,FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:36049,FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:36048,FRAMEBUFFER_ATTACHMENT_RED_SIZE:33298,FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE:33303,FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:36051,FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER:36052,FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:36050,FRAMEBUFFER_BINDING:36006,FRAMEBUFFER_COMPLETE:36053,FRAMEBUFFER_DEFAULT:33304,FRAMEBUFFER_INCOMPLETE_ATTACHMENT:36054,FRAMEBUFFER_INCOMPLETE_DIMENSIONS:36057,FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:36055,FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:36182,FRAMEBUFFER_UNSUPPORTED:36061,FRONT:1028,FRONT_AND_BACK:1032,FRONT_FACE:2886,FUNC_ADD:32774,FUNC_REVERSE_SUBTRACT:32779,FUNC_SUBTRACT:32778,GENERATE_MIPMAP_HINT:33170,GEQUAL:518,GREATER:516,GREEN_BITS:3411,HALF_FLOAT:5131,HIGH_FLOAT:36338,HIGH_INT:36341,IMPLEMENTATION_COLOR_READ_FORMAT:35739,IMPLEMENTATION_COLOR_READ_TYPE:35738,INCR:7682,INCR_WRAP:34055,INT:5124,INTERLEAVED_ATTRIBS:35980,INT_2_10_10_10_REV:36255,INT_SAMPLER_2D:36298,INT_SAMPLER_2D_ARRAY:36303,INT_SAMPLER_3D:36299,INT_SAMPLER_CUBE:36300,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,INVALID_ENUM:1280,INVALID_FRAMEBUFFER_OPERATION:1286,INVALID_INDEX:4294967295,INVALID_OPERATION:1282,INVALID_VALUE:1281,INVERT:5386,KEEP:7680,LEQUAL:515,LESS:513,LINEAR:9729,LINEAR_MIPMAP_LINEAR:9987,LINEAR_MIPMAP_NEAREST:9985,LINES:1,LINE_LOOP:2,LINE_STRIP:3,LINE_WIDTH:2849,LINK_STATUS:35714,LOW_FLOAT:36336,LOW_INT:36339,LUMINANCE:6409,LUMINANCE_ALPHA:6410,MAX:32776,MAX_3D_TEXTURE_SIZE:32883,MAX_ARRAY_TEXTURE_LAYERS:35071,MAX_CLIENT_WAIT_TIMEOUT_WEBGL:37447,MAX_COLOR_ATTACHMENTS:36063,MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS:35379,MAX_COMBINED_TEXTURE_IMAGE_UNITS:35661,MAX_COMBINED_UNIFORM_BLOCKS:35374,MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS:35377,MAX_CUBE_MAP_TEXTURE_SIZE:34076,MAX_DRAW_BUFFERS:34852,MAX_ELEMENTS_INDICES:33001,MAX_ELEMENTS_VERTICES:33000,MAX_ELEMENT_INDEX:36203,MAX_FRAGMENT_INPUT_COMPONENTS:37157,MAX_FRAGMENT_UNIFORM_BLOCKS:35373,MAX_FRAGMENT_UNIFORM_COMPONENTS:35657,MAX_FRAGMENT_UNIFORM_VECTORS:36349,MAX_PROGRAM_TEXEL_OFFSET:35077,MAX_RENDERBUFFER_SIZE:34024,MAX_SAMPLES:36183,MAX_SERVER_WAIT_TIMEOUT:37137,MAX_TEXTURE_IMAGE_UNITS:34930,MAX_TEXTURE_LOD_BIAS:34045,MAX_TEXTURE_SIZE:3379,MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS:35978,MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS:35979,MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS:35968,MAX_UNIFORM_BLOCK_SIZE:35376,MAX_UNIFORM_BUFFER_BINDINGS:35375,MAX_VARYING_COMPONENTS:35659,MAX_VARYING_VECTORS:36348,MAX_VERTEX_ATTRIBS:34921,MAX_VERTEX_OUTPUT_COMPONENTS:37154,MAX_VERTEX_TEXTURE_IMAGE_UNITS:35660,MAX_VERTEX_UNIFORM_BLOCKS:35371,MAX_VERTEX_UNIFORM_COMPONENTS:35658,MAX_VERTEX_UNIFORM_VECTORS:36347,MAX_VIEWPORT_DIMS:3386,MEDIUM_FLOAT:36337,MEDIUM_INT:36340,MIN:32775,MIN_PROGRAM_TEXEL_OFFSET:35076,MIRRORED_REPEAT:33648,NEAREST:9728,NEAREST_MIPMAP_LINEAR:9986,NEAREST_MIPMAP_NEAREST:9984,NEVER:512,NICEST:4354,NONE:0,NOTEQUAL:517,NO_ERROR:0,OBJECT_TYPE:37138,ONE:1,ONE_MINUS_CONSTANT_ALPHA:32772,ONE_MINUS_CONSTANT_COLOR:32770,ONE_MINUS_DST_ALPHA:773,ONE_MINUS_DST_COLOR:775,ONE_MINUS_SRC_ALPHA:771,ONE_MINUS_SRC_COLOR:769,OUT_OF_MEMORY:1285,PACK_ALIGNMENT:3333,PACK_ROW_LENGTH:3330,PACK_SKIP_PIXELS:3332,PACK_SKIP_ROWS:3331,PIXEL_PACK_BUFFER:35051,PIXEL_PACK_BUFFER_BINDING:35053,PIXEL_UNPACK_BUFFER:35052,PIXEL_UNPACK_BUFFER_BINDING:35055,POINTS:0,POLYGON_OFFSET_FACTOR:32824,POLYGON_OFFSET_FILL:32823,POLYGON_OFFSET_UNITS:10752,QUERY_RESULT:34918,QUERY_RESULT_AVAILABLE:34919,R8:33321,R8I:33329,R8UI:33330,R8_SNORM:36756,R11F_G11F_B10F:35898,R16F:33325,R16I:33331,R16UI:33332,R32F:33326,R32I:33333,R32UI:33334,RASTERIZER_DISCARD:35977,READ_BUFFER:3074,READ_FRAMEBUFFER:36008,READ_FRAMEBUFFER_BINDING:36010,RED:6403,RED_BITS:3410,RED_INTEGER:36244,RENDERBUFFER:36161,RENDERBUFFER_ALPHA_SIZE:36179,RENDERBUFFER_BINDING:36007,RENDERBUFFER_BLUE_SIZE:36178,RENDERBUFFER_DEPTH_SIZE:36180,RENDERBUFFER_GREEN_SIZE:36177,RENDERBUFFER_HEIGHT:36163,RENDERBUFFER_INTERNAL_FORMAT:36164,RENDERBUFFER_RED_SIZE:36176,RENDERBUFFER_SAMPLES:36011,RENDERBUFFER_STENCIL_SIZE:36181,RENDERBUFFER_WIDTH:36162,RENDERER:7937,REPEAT:10497,REPLACE:7681,RG:33319,RG8:33323,RG8I:33335,RG8UI:33336,RG8_SNORM:36757,RG16F:33327,RG16I:33337,RG16UI:33338,RG32F:33328,RG32I:33339,RG32UI:33340,RGB:6407,RGB5_A1:32855,RGB8:32849,RGB8I:36239,RGB8UI:36221,RGB8_SNORM:36758,RGB9_E5:35901,RGB10_A2:32857,RGB10_A2UI:36975,RGB16F:34843,RGB16I:36233,RGB16UI:36215,RGB32F:34837,RGB32I:36227,RGB32UI:36209,RGB565:36194,RGBA:6408,RGBA4:32854,RGBA8:32856,RGBA8I:36238,RGBA8UI:36220,RGBA8_SNORM:36759,RGBA16F:34842,RGBA16I:36232,RGBA16UI:36214,RGBA32F:34836,RGBA32I:36226,RGBA32UI:36208,RGBA_INTEGER:36249,RGB_INTEGER:36248,RG_INTEGER:33320,SAMPLER_2D:35678,SAMPLER_2D_ARRAY:36289,SAMPLER_2D_ARRAY_SHADOW:36292,SAMPLER_2D_SHADOW:35682,SAMPLER_3D:35679,SAMPLER_BINDING:35097,SAMPLER_CUBE:35680,SAMPLER_CUBE_SHADOW:36293,SAMPLES:32937,SAMPLE_ALPHA_TO_COVERAGE:32926,SAMPLE_BUFFERS:32936,SAMPLE_COVERAGE:32928,SAMPLE_COVERAGE_INVERT:32939,SAMPLE_COVERAGE_VALUE:32938,SCISSOR_BOX:3088,SCISSOR_TEST:3089,SEPARATE_ATTRIBS:35981,SHADER_TYPE:35663,SHADING_LANGUAGE_VERSION:35724,SHORT:5122,SIGNALED:37145,SIGNED_NORMALIZED:36764,SRC_ALPHA:770,SRC_ALPHA_SATURATE:776,SRC_COLOR:768,SRGB:35904,SRGB8:35905,SRGB8_ALPHA8:35907,STATIC_COPY:35046,STATIC_DRAW:35044,STATIC_READ:35045,STENCIL:6146,STENCIL_ATTACHMENT:36128,STENCIL_BACK_FAIL:34817,STENCIL_BACK_FUNC:34816,STENCIL_BACK_PASS_DEPTH_FAIL:34818,STENCIL_BACK_PASS_DEPTH_PASS:34819,STENCIL_BACK_REF:36003,STENCIL_BACK_VALUE_MASK:36004,STENCIL_BACK_WRITEMASK:36005,STENCIL_BITS:3415,STENCIL_BUFFER_BIT:1024,STENCIL_CLEAR_VALUE:2961,STENCIL_FAIL:2964,STENCIL_FUNC:2962,STENCIL_INDEX8:36168,STENCIL_PASS_DEPTH_FAIL:2965,STENCIL_PASS_DEPTH_PASS:2966,STENCIL_REF:2967,STENCIL_TEST:2960,STENCIL_VALUE_MASK:2963,STENCIL_WRITEMASK:2968,STREAM_COPY:35042,STREAM_DRAW:35040,STREAM_READ:35041,SUBPIXEL_BITS:3408,SYNC_CONDITION:37139,SYNC_FENCE:37142,SYNC_FLAGS:37141,SYNC_FLUSH_COMMANDS_BIT:1,SYNC_GPU_COMMANDS_COMPLETE:37143,SYNC_STATUS:37140,TEXTURE:5890,TEXTURE0:33984,TEXTURE1:33985,TEXTURE2:33986,TEXTURE3:33987,TEXTURE4:33988,TEXTURE5:33989,TEXTURE6:33990,TEXTURE7:33991,TEXTURE8:33992,TEXTURE9:33993,TEXTURE10:33994,TEXTURE11:33995,TEXTURE12:33996,TEXTURE13:33997,TEXTURE14:33998,TEXTURE15:33999,TEXTURE16:34000,TEXTURE17:34001,TEXTURE18:34002,TEXTURE19:34003,TEXTURE20:34004,TEXTURE21:34005,TEXTURE22:34006,TEXTURE23:34007,TEXTURE24:34008,TEXTURE25:34009,TEXTURE26:34010,TEXTURE27:34011,TEXTURE28:34012,TEXTURE29:34013,TEXTURE30:34014,TEXTURE31:34015,"TEXTURE_2D":3553,"TEXTURE_2D_ARRAY":35866,"TEXTURE_3D":32879,"TEXTURE_BASE_LEVEL":33084,"TEXTURE_BINDING_2D":32873,"TEXTURE_BINDING_2D_ARRAY":35869,"TEXTURE_BINDING_3D":32874,"TEXTURE_BINDING_CUBE_MAP":34068,"TEXTURE_COMPARE_FUNC":34893,"TEXTURE_COMPARE_MODE":34892,"TEXTURE_CUBE_MAP":34067,"TEXTURE_CUBE_MAP_NEGATIVE_X":34070,"TEXTURE_CUBE_MAP_NEGATIVE_Y":34072,"TEXTURE_CUBE_MAP_NEGATIVE_Z":34074,"TEXTURE_CUBE_MAP_POSITIVE_X":34069,"TEXTURE_CUBE_MAP_POSITIVE_Y":34071,"TEXTURE_CUBE_MAP_POSITIVE_Z":34073,"TEXTURE_IMMUTABLE_FORMAT":37167,"TEXTURE_IMMUTABLE_LEVELS":33503,"TEXTURE_MAG_FILTER":10240,"TEXTURE_MAX_LEVEL":33085,"TEXTURE_MAX_LOD":33083,"TEXTURE_MIN_FILTER":10241,"TEXTURE_MIN_LOD":33082,"TEXTURE_WRAP_R":32882,"TEXTURE_WRAP_S":10242,"TEXTURE_WRAP_T":10243,"TIMEOUT_EXPIRED":37147,"TIMEOUT_IGNORED":-1,"TRANSFORM_FEEDBACK":36386,"TRANSFORM_FEEDBACK_ACTIVE":36388,"TRANSFORM_FEEDBACK_BINDING":36389,"TRANSFORM_FEEDBACK_BUFFER":35982,"TRANSFORM_FEEDBACK_BUFFER_BINDING":35983,"TRANSFORM_FEEDBACK_BUFFER_MODE":35967,"TRANSFORM_FEEDBACK_BUFFER_SIZE":35973,"TRANSFORM_FEEDBACK_BUFFER_START":35972,"TRANSFORM_FEEDBACK_PAUSED":36387,"TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN":35976,"TRANSFORM_FEEDBACK_VARYINGS":35971,"TRIANGLES":4,"TRIANGLE_FAN":6,"TRIANGLE_STRIP":5,"UNIFORM_ARRAY_STRIDE":35388,"UNIFORM_BLOCK_ACTIVE_UNIFORMS":35394,"UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES":35395,"UNIFORM_BLOCK_BINDING":35391,"UNIFORM_BLOCK_DATA_SIZE":35392,"UNIFORM_BLOCK_INDEX":35386,"UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER":35398,"UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER":35396,"UNIFORM_BUFFER":35345,"UNIFORM_BUFFER_BINDING":35368,"UNIFORM_BUFFER_OFFSET_ALIGNMENT":35380,"UNIFORM_BUFFER_SIZE":35370,"UNIFORM_BUFFER_START":35369,"UNIFORM_IS_ROW_MAJOR":35390,"UNIFORM_MATRIX_STRIDE":35389,"UNIFORM_OFFSET":35387,"UNIFORM_SIZE":35384,"UNIFORM_TYPE":35383,"UNPACK_ALIGNMENT":3317,"UNPACK_COLORSPACE_CONVERSION_WEBGL":37443,"UNPACK_FLIP_Y_WEBGL":37440,"UNPACK_IMAGE_HEIGHT":32878,"UNPACK_PREMULTIPLY_ALPHA_WEBGL":37441,"UNPACK_ROW_LENGTH":3314,"UNPACK_SKIP_IMAGES":32877,"UNPACK_SKIP_PIXELS":3316,"UNPACK_SKIP_ROWS":3315,"UNSIGNALED":37144,"UNSIGNED_BYTE":5121,"UNSIGNED_INT":5125,"UNSIGNED_INT_2_10_10_10_REV":33640,"UNSIGNED_INT_5_9_9_9_REV":35902,"UNSIGNED_INT_10F_11F_11F_REV":35899,"UNSIGNED_INT_24_8":34042,"UNSIGNED_INT_SAMPLER_2D":36306,"UNSIGNED_INT_SAMPLER_2D_ARRAY":36311,"UNSIGNED_INT_SAMPLER_3D":36307,"UNSIGNED_INT_SAMPLER_CUBE":36308,"UNSIGNED_INT_VEC2":36294,"UNSIGNED_INT_VEC3":36295,"UNSIGNED_INT_VEC4":36296,"UNSIGNED_NORMALIZED":35863,"UNSIGNED_SHORT":5123,"UNSIGNED_SHORT_4_4_4_4":32819,"UNSIGNED_SHORT_5_5_5_1":32820,"UNSIGNED_SHORT_5_6_5":33635,"VALIDATE_STATUS":35715,"VENDOR":7936,"VERSION":7938,"VERTEX_ARRAY_BINDING":34229,"VERTEX_ATTRIB_ARRAY_BUFFER_BINDING":34975,"VERTEX_ATTRIB_ARRAY_DIVISOR":35070,"VERTEX_ATTRIB_ARRAY_ENABLED":34338,"VERTEX_ATTRIB_ARRAY_INTEGER":35069,"VERTEX_ATTRIB_ARRAY_NORMALIZED":34922,"VERTEX_ATTRIB_ARRAY_POINTER":34373,"VERTEX_ATTRIB_ARRAY_SIZE":34339,"VERTEX_ATTRIB_ARRAY_STRIDE":34340,"VERTEX_ATTRIB_ARRAY_TYPE":34341,"VERTEX_SHADER":35633,"VIEWPORT":2978,"WAIT_FAILED":37149,"ZERO":0};
for (const [key, value] of Object.entries(constants)) {
    Object.defineProperty(WebGLRenderingContext.prototype, key, {
        value,
        writable: false,
        enumerable: false,
        configurable: true,
    });
}


WebGL2RenderingContext=function WebGL2RenderingContext(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    } else {}
}  //不能new
fun_to_native(WebGL2RenderingContext)

Object.defineProperty(WebGL2RenderingContext.prototype, Symbol.toStringTag, {
    value: 'WebGL2RenderingContext',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGL2RenderingContext.prototype, 'drawingBufferColorSpace', {
    value: 'srgb',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

Object.defineProperty(WebGL2RenderingContext.prototype, 'drawingBufferFormat', {
    value: 32856,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGL2RenderingContext.prototype, 'drawingBufferHeight', {
    value: 150,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(WebGL2RenderingContext.prototype, 'drawingBufferWidth', {
    value: 300,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});



// canvas标签
HTMLCanvasElement=function HTMLCanvasElement(){
  if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {}
}//不能new
Object.setPrototypeOf(HTMLCanvasElement, HTMLElement);
Object.setPrototypeOf(HTMLCanvasElement.prototype, HTMLElement.prototype);
Object.defineProperty(HTMLCanvasElement.prototype, Symbol.toStringTag, {
  value: 'HTMLCanvasElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
getContext=function getContext(ele) {
  xuxu_log('CanvasRenderingContext2D getContext:::', ele);
  if (ele == '2d'){
    var canvas2d = xuxuwatch({}, 'canvas2d');
    xuxu_log('getContext 创建了一个canvas的2d对象:',ele);
    Object.setPrototypeOf(canvas2d, CanvasRenderingContext2D.prototype);
    return canvas2d
  }
  if (ele == 'webgl'){
    var webkglrenderingcontext=xuxuwatch({
        canvas:this
    }, 'webkglrenderingcontext')
    Object.setPrototypeOf(webkglrenderingcontext, WebGLRenderingContext.prototype);
    xuxu_log('getContext 创建了一个canvas的webgl对象:',ele);
    return webkglrenderingcontext
  }
  if (ele == 'webgl2'){
    var webkgl2renderingcontext = xuxuwatch({}, 'webkgl2renderingcontext')
    Object.setPrototypeOf(webkgl2renderingcontext, WebGL2RenderingContext.prototype);
    xuxu_log('getContext 创建了一个canvas的webgl2对象:',ele);
    return webkgl2renderingcontext
  }
  debugger
  xuxu_log('漏掉了',ele)
},
fun_to_native(getContext)
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: getContext,
    writable: true,
    enumerable: true,
    configurable: true
});
delete getContext;


toDataURL=function toDataURL(){
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAAE7dJREFUeF7tm3lUFFe+x78FQoMoooK4a1RUVNSgAmZyojK4xHh87gbXcYyAeec4mnlJJmre5EQTYxZFJxFoRh3NRE0Gl5dJPE80xi1RcImK0RgFF0BEcGGVFqHeudVdTdO0iAGD9+XLX0JX3frV5/erT//urasC/pAACZCAJAQUSeJkmHVIQI2AWofDSTOUYgTrXZpsOQ6UCZQ8gb8kfArrl1DjOU8CAQrrScjCrxwDhfUrA+fl6owAhVVnKOUZiMKSJ1eMtDKBqsKavtEDbiVfQFFH2hz6JxgjV2u/vxTvC6fyfVCV+YiP2IU5xhjt7/ERc2sFV78usFob1/4nIm4eVMXfeh1HcapKbK3jqNVNyHHyryGsbHhiHKKwBpvQBxkPBLMLPTEC87TPvVGIPVhZ7fG1Icw1rNrQezLOrSysyNg+UJU9AJY4ENQ+TQb2wqqr+3gUYVXIapc1zorzgRK3Sfh0RlFdhfb/bZzHLSwhq8H4M3LRqFoBnUJbTMYcfI54TVJCXvMxCfvwEXyRX+fYKaw6R/qrD1ghLDsJzP4RzZxL8K6iok2JycPzZm67QDdDUVxCwn9/IDosvy5Jy0OHrBt25MiE5qdOD0uLiIrQKswYF5cJYJXlTnKhqGGIizplEd02ADsBLLV8/hPKnQbDZCjUuzqDoQgjhn/yfUvf1JVxA5BgJWLpsCIjIy7kFfgEbNm8ZCAUTJ49LyrdPs5GnjcTtgzJmVWFpn1XZtuRCVmXO72unaOo4dA/Ex2kokZZxnofwGhrd1mTdM0xDgcwxtr5VR7PfP9/n5ON6jpb85eEY3biXEddrm1HWvFF5O2ok5mLqYjFc9rddMd1qzCEQHagL2LwWU3uVDtGHyscR3EC7RDvGYO0wOt45jzgl1V5GHGs+BHjn+gEHPJzwnF0QOfymwg/k1/l+BoH8YADKazaEqz/8yuEpRU1PhcSiIyMaqKW4U+Kgu/i+mOFVohH0akcWFpianhrw8aVv7cXlvZAmh+S4dYORzysihqtPZTixzyVTNM+Fz9i6glc1c61PLA+vpfWjx27LEwpx54HCaukpGEnEYOHx+3DU6f95Z6i4mc9Tl20YvgyNyxc2xO3tGtVdGCVrme9vqPuUtyPeAZ1qeiyUZURDqettvk0n7vKKj7xmT0f6+9ls+DmvN4ai34s8KYm/DLn69Wys+VsKz8xvXYqv651zaoyTYt5+kaPke5HC8UlvoARa/E7rbMR//aACasRWul3fcpmK7LqyvYfeAYTcRwX4YM/eE7AtP5GNHIuRuiZysIqggGTEIHh+BHPt9qLA/7Ac+eAFVlTgU5X0b/jQYw+BvjUYaNFYdW/cGobQYWwLEUfEJA4duAzW+fbSkC/SOQJPFdqMsxP3B3Zz92t8K+2HdbMmfPLLl0KHHPg0LQXREcVeQyvABiSk9MhwNm59E7pffe3dux4bZkmutB1g1QFF/Jut5xScreRTwvfS/tyb3Rcsmt35IpRo1aUNm16vdxyzW91EVkedn/RYakKfI3G2E1tWp/f373boSZnzw1CVpaftZsTcaIcUXBCbFwgDmhj2TzUsxfMKRVdmanEw190jlpHtmVJtBD2kCHr3/fzS+pTVubiknujw/gGrvf2bx1+dVLEcSw3lXiE5NzoGOLqWpTg2+KyYLetklQrd0kV634AJif6vpSR1X35d4emThHiEOMpKnposakocAIWxwxAmi5cPbbm3uknystcvvn0n8vDH8Qu9ULQR3v3/2HD+PHvpDT3vnpJsIGqrEG507jIqDlTNV798LrgIr6IGl/1HpeDxggqv4KCM31xMOt3mrB2BZuQ5WUm71YKqzBE95Ps0xhvJr2lfVaTdabY4Mb4xqsVBhdcg5tboSYj2w5LF9Y87EVR8I/auOOShGFDcc7QDM8GJcA/EwhMq22JV5xPYdUdy/oaqYqwxox5/w3fFqmTKj3sttFZ1rDsO6wXpyxyu3K59+TDhye59w7YgyZe2UhOHgOTyQPBwdvW9/Tf57Vtx6LePt6XlwrRqU7I/3zL25dL77mFhocvSleB/HVrP+lakw5LfwD1ri/3VvsGW7cummh++JWdDtewLN3M4EFrI7v6Jy0GkGeMiV/h3ijvy3Fjll4tU10KxTRTE1aXpBfu3vU69ek/l4sO8eXIOVG/h4r+F34eGK2Lwbv5VXeo2GAV1gPW4HRx5xX45OrTWDGeqqCr3gGKY8TvcMUH6Rd7fXnrVpseSUnjxN3kThi3dIOn143uiYmRAfqXhD07Z5fSXGOs0bNP78ROISEJN7/aOf9iZkYPn9nzIxZp0+Vy7MnO6XzfZHLfeP78M43T0vphlOEYJgStQymcsSr5FTh1TYWvVwaWJF9BsOka9gQA2V7AmGTAwwRtynbYD0CpCxKOzUJ0/s5qF8c3+TfFsrRIvN9sLa755zxQWFGG3cgP+gm+d4CwFIuw0ApDg83TUCGxuvqhsOqKZP2NU2VK+MLI1X9v2+ZsoP6NXyW0aoSVfrXH6KKi5jOCg7ZNgBPWW7sbADMPNfw4JSVsYkGB9+tCWFp3Eh/XWkwh/zhr3kHFqcxv8+Z32nk0vm182JRQF5aITe8aFAWu9++7GK5ldQu5dbP120kvJX5YKXaLsGZM/6/N7u75I7X7i4svEmtDQ4asW9u2zbmJ3+6b2dPPL/mtrn5JYdk3On+xY8drr7Zrf/qN55//ZIo2RY2LPyimZsFBW9f26ZM4UAE2O+qwDG6FI7V1uJapYjpq7hItU+6+fRP/HDxgm1i8qdydVUw3zcJtWNxF7/ie6nhylG1Xa8+ugaGk4/btb+wpvef+3pjR751NPjq2zdmzgxZGzo24e8/k9vL27Qv737nj2xmA1vWtighVxVTvPwNicNvrvial/V0bYJNXdyQk/xFPmQqqLHyLBfIwLIB3q1TM6rUeTXC3yjTPlre+oL6y1cfVCivMcBItgg5auyl9XWt8wGfIb0hh1Z8answrV1l0Dw7Zmt239y63SsKyfTOoKicdLbqLKeHF1AHh90sNy7SHWYGr7S0Lmfzww/N9aiqspO8nPHUqZejX1reANovuGRn+I7/+eoHJvpOaccBzWl5ei4/c3AtzmjS9fqjSGpZlSjh92uub3T3utNY+Wx3bTkhBSKRXz70R+/ZPf1oXVkF+sw2bNr83z8/vyL/EFFYTcFxsnlgP8uuS9KpVurYvBgDoU7pTJ4e7JiWNm2Vdw7IwFLLr2zcxsFIHqy+qK+rL2gsKAC9+67O+ML/5BDEldHa+X2DbYTkS1uHvx0enpAzbPmLExznFRU06Hdg/s5+YDubebB+yNWGxh85KdKWNUn1Ts10aoh+uoHlxuSasYgPwZX8gz6UBvivvinFnijE167K2niW2HdivYeV4AjsD4XAxXcT/MGGJYzQ5GUzW6V+3NPO6lpgmOgf8SGE9mc6o16iqbGsQ60IhwQmp3i3SF2gdUoWszIvlBlOjB70lzEz373fq9FC/YUPjjrsYTNFxa+LPW/ds2YnuYR2W9sAfGe9baYFeUXdFRkQ20BfdoSrmrRb6j0VKoYP+MdOv6+H5lboYy5Tt2Wc3e/Xo9W3Kz+eCl+7bPztOLHTPjYj4oKDYa6WtsDShxMb19fLKnjd27LvHXA0la+JijOHijaFfl6RZDxKWCMX2Deu1zO7X/v3VK+X6S4mOHU6GDw0zpju5lH0cF2N0115KlDlPhHPZv8Tbx4ioiNCyUpen09ICBxw+Mrls4MDPX6tJh6UJONr4TqfOx6L8ux261rBx3oSmTTNnXjwfkrt336zxOpOi4qadTp8OC26b0lLrsA56+eJM8khsMW3UFt3/beiO+KBGGNzwJIpLPZB5bDBi8v/HivhCK2BvL/Ov9gvpj9Jh6VKbZpiGOUF/Q487RShLqdjW8F2webWdU8J69cMTd/EqG0cD/ja+u3fzjMM3b7b3Op0SpgesTSXEt7Op1PDhoe/Dg9Ryp8WOtjXs2LqwbUDvPVMuXe4LsVYC/Y2a3VTSUZcg1rRKShotCw1dd9an+dVlGz/9MDw4ZOvIu8WeOH16qLYp1LLe42uM3vh28KDPjroa7vrra2X6+tXsv8wwiLWb1AtBvt9885KrtRObvtGjR+CuA61aXQg8emw08vNamMc8geeKCz3fsJ0S6h2Qx4L31gUG7pyVmdld3I/Y1vCsmEKKda4qU0IH6dXXsFQFZ8XCd4uFCz+z4VOx7WOOcbhnkxv/Gxj4NS5cCMnLzPCfLGTWq+fe3UFBO9o+bEpoEdYAMYb4wmjmnb5NUeHnpGJJjNH4qhBZmzY/4fixUbs33t0yNApT8VHAEqheBdo08CtTfy16ffNma88MreN6+rJ54Vtfw7JdjK+umh11WGlZVfdZiQ7ur8FttaFSk4ZpC/pdDBnYEQQuuj9xuqj/gBz+1xybdaEq2xrEgq94OFyL4SW2OehdjHjrJW5Hexsl3hCq6K9PK/XFcXGsE3DC9jxxjr7oLMYVv+sLxWJ9yOFnlm0M+riqE9LFdXWckUcxQXw538ju/O72L1/7D9x1j9Y3ktpse8gT59j/7ugNo34/lkX3lS+GL/65SeMc70qL7g/JpYhJdcIAnU+lRXdLvApgVIEInan1/gCD4oxVTmXIqI6dvoVDfwOpKsi0LuxbriFysiYeqbqAvIrNC+uHu1ZdZP+ho/lNYbo3cNnnl3U7oiPTtyzY78PSkdkfI2LTr81tDfUviScpggf+X0KrZBQ0tgnYus3AVkJCLLbCEsdXem0v/mB5o2Z/nr2wxENn25WUuWG5vjFUG8bSqegx2U6/9L9ZH9Ro4wAoajcxjbQVhP05tmPqwtLXsKCo2m56cT95t1u+ILZhNPe5us6lwb2W9i8WHiWxtnxUFfeEkMQUXJOtgpnavYq/A5uFfKHgmJOKHTURls0YFdtCbHIScAWjhKg6ZQOnO5indq1vQetq7jQ030WD8uqnfDW9V0fCciQk61vIOry2fYx8S1jTrD25x/0m/vOzRVBRZW6ItW4krUlO7HaI61POufNm+JYreLM2wqrJ5R/XMY/7v+Y8rrhrOy6FVVuC9X/+b0JYlo6jvXUT6iNwt+nGrLvpbaepjyTAR7ju4zyUwnqcdDn24yTwmxBWbQHa7vWyTEuta0O1Hbs+zqew6oM6r1kXBCisuqAo2RgUlmQJY7hWAhQWi4EESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAhSWNKlioCRAAhQWa4AESEAaAv8HGgmTDyASFOYAAAAASUVORK5CYII="
}
fun_to_native(toDataURL)
Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: toDataURL,
  writable: true,
  enumerable: true,
  configurable: true
});
delete toDataURL;

toBlob=function toBlob(){
    debugger
    xuxu_log('toBlob=>',arguments)
}
fun_to_native(toBlob)
Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: toBlob,
  writable: true,
  enumerable: true,
  configurable: true
});
fun_to_native(HTMLCanvasElement)
delete toBlob;

CanvasRenderingContext2D=function CanvasRenderingContext2D(){
  if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {}
}//不能new
Object.setPrototypeOf(CanvasRenderingContext2D, HTMLElement);
Object.setPrototypeOf(CanvasRenderingContext2D.prototype, HTMLElement.prototype);
Object.defineProperty(CanvasRenderingContext2D.prototype, Symbol.toStringTag, {
  value: 'CanvasRenderingContext2D',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
Object.defineProperty(CanvasRenderingContext2D.prototype, 'direction', {
    value: 'ltr',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillStyle', {
    value: '#000000',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', {
    value: 'none',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'font', {
    value: '10px sans-serif',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'fontKerning', {
    value: 'auto',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'fontStretch', {
    value: 'normal',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'fontVariantCaps', {
    value: 'normal',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'globalAlpha', {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'globalCompositeOperation', {
    value: 'source-over',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'imageSmoothingEnabled', {
    value: true,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'imageSmoothingQuality', {
    value: 'low',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'letterSpacing', {
    value: '0px',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineCap', {
    value: 'butt',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineDashOffset', {
    value: 0,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineJoin', {
    value: 'miter',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'lineWidth', {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'miterLimit', {
    value: 10,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowBlur', {
    value: 0,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowColor', {
    value: 'rgba(0, 0, 0, 0)',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowOffsetX', {
    value: 0,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowOffsetY', {
    value: 0,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', {
    value: '#000000',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'textAlign', {
    value: 'start',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'textBaseline', {
    value: 'alphabetic',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'textRendering', {
    value: 'auto',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(CanvasRenderingContext2D.prototype, 'wordSpacing', {
    value: '0px',
    writable: true,
    enumerable: true,
    configurable: true
});

fillRect=function fillRect(ele) {
    xuxu_log('CanvasRenderingContext2D fillRect:::', ele);
}
fun_to_native(fillRect)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillRect', {
    value: fillRect,
    writable: true,
    enumerable: true,
    configurable: true
});
delete fillRect;


arc=function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    xuxu_log('CanvasRenderingContext2D arc:::', x, y, radius, startAngle, endAngle, anticlockwise);
},
fun_to_native(arc)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'arc', {
    value: arc,
    writable: true,
    enumerable: true,
    configurable: true
});
delete arc;

rect=function rect(ele) {
    xuxu_log('CanvasRenderingContext2D rect:::', ele);
},
fun_to_native(rect)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'rect', {
    value: rect,
    writable: true,
    enumerable: true,
    configurable: true
});
delete rect;


stroke=function stroke(ele) {
    xuxu_log('CanvasRenderingContext2D stroke:::', ele);
},
fun_to_native(stroke)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'stroke', {
    value: stroke,
    writable: true,
    enumerable: true,
    configurable: true
});
delete stroke;


fillText=function fillText(ele) {
    xuxu_log('CanvasRenderingContext2D fillText:::', ele);
},
fun_to_native(fillText)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillText', {
    value: fillText,
    writable: true,
    enumerable: true,
    configurable: true
});
delete fillText;

fill=function fill(ele) {
    xuxu_log('CanvasRenderingContext2D fill:::', ele);
},
fun_to_native(fill)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'fill', {
    value: fill,
    writable: true,
    enumerable: true,
    configurable: true
});
delete fill;

beginPath=function beginPath(ele) {
    xuxu_log('CanvasRenderingContext2D beginPath:::', ele);
},
fun_to_native(beginPath)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'beginPath', {
    value: beginPath,
    writable: true,
    enumerable: true,
    configurable: true
});
delete beginPath;


closePath=function closePath(ele) {
    xuxu_log('CanvasRenderingContext2D closePath:::', ele);
},
fun_to_native(closePath)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'closePath', {
    value: closePath,
    writable: true,
    enumerable: true,
    configurable: true
});
delete closePath;


isPointInPath=function isPointInPath(ele) {
    xuxu_log('CanvasRenderingContext2D isPointInPath:::', ele);
    debugger
    return false
},
fun_to_native(isPointInPath)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'isPointInPath', {
    value: isPointInPath,
    writable: true,
    enumerable: true,
    configurable: true
});
delete isPointInPath;


getImageData=function getImageData(x, y, w, h) {
    xuxu_log('CanvasRenderingContext2D getImageData:::', x, y, w, h);
    debugger;
    var imagedata = xuxuwatch({
        data: new Uint8ClampedArray([300, -50, -50, 255]),
        colorSpace: "srgb",
        height: h,
        width: w,
    }, 'imgedata')
    return imagedata
},
fun_to_native(getImageData)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'getImageData', {
    value: getImageData,
    writable: true,
    enumerable: true,
    configurable: true
});
delete getImageData;

putImageData=function putImageData(ele) {
    xuxu_log('CanvasRenderingContext2D putImageData:::', ele);
},
fun_to_native(putImageData)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'putImageData', {
    value: putImageData,
    writable: true,
    enumerable: true,
    configurable: true
});
delete putImageData;

measureText=function measureText(ele) {
    xuxu_log('CanvasRenderingContext2D measureText:::', ele);
    const fontSize = 16; // 假设字体大小为 16px
    if (ele === '') {
        var measureTextobj = xuxuwatch({
            actualBoundingBoxAscent: 0,
            actualBoundingBoxDescent: 0,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 0,
            alphabeticBaseline: 0,
            fontBoundingBoxAscent: fontSize * 0.2, // 默认字体框的上边界
            fontBoundingBoxDescent: fontSize * 0.2, // 默认字体框的下边界
            hangingBaseline: fontSize * 0.1, // 默认悬挂基线
            ideographicBaseline: fontSize * 0.2, // 默认表意文字基线
            width: 0, // 宽度为 0
        }, 'measureTextobj');
        return measureTextobj;
    }
    xuxu_log('漏掉了');
    debugger;
};
fun_to_native(measureText)
Object.defineProperty(CanvasRenderingContext2D.prototype, 'measureText', {
    value: measureText,
    writable: true,
    enumerable: true,
    configurable: true
});
delete measureText;



// body标签
HTMLBodyElement=function HTMLBodyElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
HTMLBodyElement.__proto__=HTMLElement
HTMLBodyElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLBodyElement.prototype, Symbol.toStringTag, {
  value: 'HTMLBodyElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLBodyElement)



// iframe标签
HTMLIFrameElement=function HTMLIFrameElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
HTMLIFrameElement.__proto__=HTMLElement
HTMLIFrameElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLIFrameElement.prototype, Symbol.toStringTag, {
  value: 'HTMLIFrameElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLIFrameElement)



// video标签
HTMLVideoElement=function HTMLVideoElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
HTMLVideoElement.__proto__=HTMLElement
HTMLVideoElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLVideoElement.prototype, Symbol.toStringTag, {
  value: 'HTMLVideoElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLVideoElement)

canPlayType=function canPlayType(ele) {
    xuxu_log('video canPlayType=>', ele)
    if (ele == 'video/ogg; codecs="theora"') {
        return ''
    }
    if (ele == 'video/mp4; codecs="avc1.42E01E"') {
        return 'probably'
    }
    if (ele == 'video/webm; codecs="vp8, vorbis"') {
        return 'probably'
    }
    if (ele == 'video/mp4; codecs="avc1.4D401E"') {
        return 'probably'
    }
    if (ele == 'audio/x-m4a;') {
        return 'maybe'
    }
    if (ele == 'audio/wav; codecs="1"') {
        return 'probably'
    }
    if (ele == 'audio/ogg; codecs="vorbis"') {
        return 'probably'
    }
    if (ele == 'audio/mpeg') {
        return 'probably'
    }
    if (ele==='video/mp4; codecs="mp4v.20.8, mp4a.40.2"'){
        return ''
    }
    if (ele=='video/mp4; codecs="mp4v.20.240, mp4a.40.2"'){
        return ''
    }
    if (ele==='video/x-matroska; codecs="theora, vorbis"'){
        return ''
    }
    xuxu_log('漏掉了=>', ele)
    debugger
}
fun_to_native(canPlayType)
Object.defineProperty(HTMLVideoElement.prototype, 'canPlayType', {
  value: canPlayType,
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
delete canPlayType;


// audio标签
HTMLAudioElement=function HTMLAudioElement(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {
}
}  //不能new
HTMLAudioElement.__proto__=HTMLElement
HTMLAudioElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLAudioElement.prototype, Symbol.toStringTag, {
  value: 'HTMLAudioElement',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLAudioElement)

canPlayType=function canPlayType(ele) {
    xuxu_log('audio canPlayType=>', ele)
    if (ele == 'video/ogg; codecs="theora"') {
        return ''
    }
    if (ele == 'video/mp4; codecs="avc1.42E01E"') {
        return 'probably'
    }
    if (ele == 'video/webm; codecs="vp8, vorbis"') {
        return 'probably'
    }
    if (ele == 'video/mp4; codecs="avc1.4D401E"') {
        return 'probably'
    }
    if (ele == 'audio/x-m4a;') {
        return 'maybe'
    }
    if (ele == 'audio/wav; codecs="1"') {
        return 'probably'
    }
    if (ele == 'audio/ogg; codecs="vorbis"') {
        return 'probably'
    }
    if (ele == 'audio/mpeg') {
        return 'probably'
    }
    if (ele==='video/mp4; codecs="mp4v.20.8, mp4a.40.2"'){
        return ''
    }
    if (ele=='video/mp4; codecs="mp4v.20.240, mp4a.40.2"'){
        return ''
    }
    if (ele==='video/x-matroska; codecs="theora, vorbis"'){
        return ''
    }
    if (ele==='audio/mpeg;'){
        return 'probably'
    }
    if(ele==='audio/x-m4a;audio/aac;'){
        return 'maybe'
    }
    xuxu_log('漏掉了=>', ele)
    debugger
}
fun_to_native(canPlayType)
Object.defineProperty(HTMLAudioElement.prototype, 'canPlayType', {
  value: canPlayType,
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
delete canPlayType;


HTMLParagraphElement=function HTMLParagraphElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLParagraphElement.__proto__=HTMLElement
HTMLParagraphElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLParagraphElement.prototype, Symbol.toStringTag, {
    value: 'HTMLParagraphElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLParagraphElement);





HTMLDocument=function HTMLDocument(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {

}
}  //不能new
Object.setPrototypeOf(HTMLDocument, Document);
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
HTMLDocument.prototype.URL=''
Object.defineProperty(HTMLDocument.prototype, Symbol.toStringTag, {
  value: 'HTMLDocument',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLDocument);



CSSStyleDeclaration=function CSSStyleDeclaration(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(CSSStyleDeclaration.prototype, Symbol.toStringTag, {
    value: 'CSSStyleDeclaration',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(CSSStyleDeclaration.prototype, Symbol.iterator, {
    value: values,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(CSSStyleDeclaration)



getPropertyValue=function getPropertyValue(name){
    debugger
    return '640px'
}
fun_to_native(getPropertyValue);
Object.defineProperty(CSSStyleDeclaration.prototype, 'getPropertyValue', {
    value: getPropertyValue,
    writable: true, // 可选，设置为不可写
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete getPropertyValue;

HTMLCollection=function HTMLCollection(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(HTMLCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(HTMLCollection.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'item', {
    value: item,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'length', {
    value: 0,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'namedItem', {
    value: namedItem,
    writable: true,
    enumerable: false,
    configurable: true
});
fun_to_native(HTMLCollection)





Event=function Event(val){
    xuxu_log('Event=>',val)
    debugger
}
Object.defineProperty(Event.prototype, Symbol.toStringTag, {
    value: 'Event',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'AT_TARGET', {
    value: 2,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'BUBBLING_PHASE', {
    value: 3,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'CAPTURING_PHASE', {
    value: 1,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'NONE', {
    value: 0,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Event)





Location=function Location(){
  if (new.target) {
  throw new TypeError('Illegal constructor');
} else {

}
}//不能new
Object.defineProperty(Location.prototype, Symbol.toStringTag, {
  value: 'Location',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
fun_to_native(Location)

location=xuxuwatch({
    "ancestorOrigins": {},
    "href": "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/view/import",
    "origin": "https://swapp.singlewindow.cn",
    "protocol": "https:",
    "host": "swapp.singlewindow.cn",
    "hostname": "swapp.singlewindow.cn",
    "port": "",
    "pathname": "/qspserver/sw/qsp/query/view/import",
    "search": "",
    "hash": ""
}, 'location');
location.toString=function toString(){
    return location.href
}
fun_to_native(location.toString)
location.replace=function replace(val){
    debugger
    console.log('replace=>', val)
}
fun_to_native(location.replace)
Object.setPrototypeOf(location, Location.prototype);



BatteryManager=function BatteryManager(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
BatteryManager.__proto__=EventTarget
Object.defineProperty(BatteryManager.prototype, Symbol.toStringTag, {
    value: 'BatteryManager',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(BatteryManager.prototype, 'charging', {
    value: true,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(BatteryManager)
getBattery=function getBattery(){
    var Batteryobj=xuxuwatch({
        charging:true,
        chargingTime:0,
        dischargingTime:Infinity,
        level:1,
        onchargingchange:null,
        onchargingtimechange:null,
        ondischargingtimechange:null,
        onlevelchange:null
    }, 'Batteryobj')
    Batteryobj.__proto__=BatteryManager.prototype
    return new Promise(function(resolve, reject){
        resolve(Batteryobj)
    })
}
fun_to_native(getBattery)


NetworkInformation=function NetworkInformation(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {}
}
Object.defineProperty(NetworkInformation.prototype, Symbol.toStringTag, {
    value: 'NetworkInformation',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(NetworkInformation.prototype, 'constructor', {
    value: NetworkInformation,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
NetworkInformation.prototype.__proto__=EventTarget.prototype;
fun_to_native(NetworkInformation);
connection= xuxuwatch({
    downlink: 0.85,
    effectiveType: "4g",
    onchange: null,
    rtt: 200,
    saveData: false,
}, 'connection')
connection.__proto__=NetworkInformation.prototype


MimeTypeArray=function MimeTypeArray(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(MimeTypeArray.prototype, Symbol.toStringTag, {
    value: 'MimeTypeArray',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(MimeTypeArray.prototype, 'length', {
    value: 2,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(MimeTypeArray)



MimeType=function MimeType(_this, _type){
    this["type"] = _type,
    this["suffixes"] = "pdf"
    this["description"] = "Portable Document Format"
    this["enabledPlugin"] = _this
    this[Symbol.toStringTag] = 'MimeType'
}
fun_to_native(MimeType)

Plugin=function Plugin(){}
Object.defineProperty(Plugin.prototype, "name", {
    get: function(){
        return this.id
    },
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(Plugin.prototype, "filename", {
    value:"internal-pdf-viewer",
    writable:true,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(Plugin.prototype, "description", {
    value:"Portable Document Format",
    writable:true,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(Plugin.prototype, "length", {
    value:2,
    writable:true,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(Plugin.prototype, "item", {
    value:function(){
        debugger
    },
    writable:true,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(Plugin.prototype, "namedItem", {
    value:function(){
        debugger
    },
    writable:true,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Plugin=new Proxy(Plugin, {
    construct: function(target, args){
        let obj = {}
        Object.defineProperty(obj, Symbol.toStringTag, {
            value:'Plugin',
            writable:false,
            enumerable: false, // 可选，设置为不可枚举
            configurable: false, // 可选，设置为可配置
        })
        Object.defineProperty(obj, "0", {
            get: function(){
                return new MimeType(this, 'application/pdf')
            },
            enumerable: true, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        })
        Object.defineProperty(obj, "1", {
            get: function(){
                return new MimeType(this, 'text/pdf')
            },
            enumerable: true, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        })
        if (args[0] == 0){
            Object.defineProperty(obj, "id", {
                value:"PDF Viewer",
                writable:false,
                enumerable: false, // 可选，设置为不可枚举
                configurable: false, // 可选，设置为可配置
            })
        }
        if (args[0] == 1){
            Object.defineProperty(obj, "id", {
                value:"Chrome PDF Viewer",
                writable:false,
                enumerable: false, // 可选，设置为不可枚举
                configurable: false, // 可选，设置为可配置
            })
        }
        if (args[0] == 2){
            Object.defineProperty(obj, "id", {
                value:"Chromium PDF Viewer",
                writable:false,
                enumerable: false, // 可选，设置为不可枚举
                configurable: false, // 可选，设置为可配置
            })
        }
        if (args[0] == 3){
            Object.defineProperty(obj, "id", {
                value:"Microsoft Edge PDF Viewer",
                writable:false,
                enumerable: false, // 可选，设置为不可枚举
                configurable: false, // 可选，设置为可配置
            })
        }
        if (args[0] == 4){
            Object.defineProperty(obj, "id", {
                value:"WebKit built-in PDF",
                writable:false,
                enumerable: false, // 可选，设置为不可枚举
                configurable: false, // 可选，设置为可配置
            })
        }
        Object.defineProperty(obj, "application/pdf", {
            get: function(){
                return new MimeType(this, 'application/pdf')
            },
            enumerable: false, // 可选，设置为不可枚举
            configurable: false, // 可选，设置为可配置
        })
        Object.defineProperty(obj, "text/pdf", {
            get: function(){
                return new MimeType(this, 'text/pdf')
            },
            enumerable: false, // 可选，设置为不可枚举
            configurable: false, // 可选，设置为可配置
        })
        obj.__proto__ = Plugin.prototype
        return obj
    }
})
fun_to_native(Plugin)

PluginArray=function PluginArray(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(PluginArray.prototype, Symbol.toStringTag, {
    value: 'PluginArray',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

namedItem=function namedItem(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
    debugger
  }
}  //不能new
fun_to_native(namedItem)
Object.defineProperty(PluginArray.prototype, 'namedItem', {
    value: namedItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete namedItem;

item=function item(val){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    }else{
        if (val === 4294967296){
            return this[0]
        }
        debugger
    }
}  //不能new
fun_to_native(item)
Object.defineProperty(PluginArray.prototype, 'item', {
    value: item,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete item


function refresh(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
fun_to_native(refresh)
Object.defineProperty(refresh.prototype, 'name', {
    value: "refresh",
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(PluginArray.prototype, 'length', {
    value: 5,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(PluginArray.prototype, 'refresh', {
    value: refresh,
    writable: true, // 可选，设置为不可写
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(PluginArray)
plugins_s = {}
plugins_s["0"] = new Plugin(0);
plugins_s["1"] = new Plugin(1);
plugins_s["2"] = new Plugin(2);
plugins_s["3"] = new Plugin(3);
plugins_s["4"] = new Plugin(4);
plugins_s['Chrome PDF Viewer'] = plugins_s["1"]
plugins_s['Chromium PDF Viewer'] = plugins_s["2"]
plugins_s['Microsoft Edge PDF Viewer'] = plugins_s["3"]
plugins_s['internal-pdf-viewer'] = plugins_s["0"]
plugins_s['WebKit built-in PDF'] = plugins_s["4"]
plugins_s.__proto__=PluginArray.prototype


mimeTypes_s={}
mime=new Plugin(0)
mimeTypes_s["0"] = mime[0]
mimeTypes_s["1"] = mime[1]
mimeTypes_s["application/pdf"] = mime["application/pdf"]
mimeTypes_s["text/pdf"] = mime["text/pdf"]
Object.setPrototypeOf(mimeTypes_s, MimeTypeArray.prototype);


queryUsageAndQuota=function(val){}
fun_to_native(queryUsageAndQuota)
requestQuota=function(val){}
fun_to_native(requestQuota)
DeprecatedStorageQuota ={
    queryUsageAndQuota:queryUsageAndQuota,
    requestQuota:requestQuota,
    [Symbol.toStringTag]:'DeprecatedStorageQuota'
}
webkitPersistentStorage=xuxuwatch({},'webkitPersistentStorage')
webkitPersistentStorage.__proto__=DeprecatedStorageQuota

_vibrate_=function vibrate(val){
    xuxu_log('vibrate=>', val)
    debugger
}
fun_to_native(_vibrate_)

_sendBeacon_=function sendBeacon(val){
    xuxu_log('sendBeacon=>', val)
    debugger
}
fun_to_native(_sendBeacon_)


Navigator=function Navigator(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Navigator.prototype = {
    [Symbol.toStringTag]:'Navigator',
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0",
    product: 'Gecko',
    productSub: '20030107',
    language: 'zh-CN',
    platform:'Win32',
    locks:xuxuwatch({
        [Symbol.toStringTag]:'LockManager'
    },'locks'),
    doNotTrack:null,
    maxTouchPoints:0,
    plugins:xuxuwatch(plugins_s, 'plugins'),
    mimeTypes:xuxuwatch(mimeTypes_s, 'mimeTypes'),
    webkitPersistentStorage:webkitPersistentStorage,
    hardwareConcurrency:8,
    connection: xuxuwatch(connection,'connection'),
    getBattery:getBattery,
    vibrate:_vibrate_,
    sendBeacon:_sendBeacon_,
}
Navigator.prototype=xuxuwatch(Navigator.prototype, `方法原型:Navigator.prototype`)
Navigator=xuxuwatch(Navigator, 'Navigator')

webdriver=function webdriver(){
    return false
}
webdriver.prototype=undefined;
webdriver[syString]='function get webdriver() { [native code] }'
Object.defineProperty(Navigator.prototype,'webdriver', {
    get:webdriver,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete webdriver;

languages=function languages(){
    return ["zh-CN"]
}
languages.prototype=undefined;
languages[syString]='function get languages() { [native code] }'
Object.defineProperty(Navigator.prototype,'languages', {
    get:languages,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete languages;

vendor=function vendor(){
    return 'Google Inc.'
}
vendor.prototype=undefined;
vendor[syString]='function get vendor() { [native code] }'
Object.defineProperty(Navigator.prototype,'vendor', {
    get:vendor,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
delete vendor;
fun_to_native(Navigator)

navigator = xuxuwatch({},'navigator');
Object.setPrototypeOf(navigator, Navigator.prototype);

nav_obj=xuxuwatch({
    languages: Object.getOwnPropertyDescriptor(Navigator.prototype, 'languages'),
    vendor: Object.getOwnPropertyDescriptor(Navigator.prototype, 'vendor'),
}, 'nav_obj');

History=function History() {
    if (new.target) {
      throw new TypeError('Illegal constructor');
    } else {
  
    }
  } //不能new
fun_to_native(History)

replaceState=function replaceState(val){
    xuxu_log('history.replaceState=>',val)
    debugger
}
fun_to_native(replaceState)
History.prototype = {
    length:6,
    state:null,
    scrollRestoration:'auto',
    replaceState:replaceState,
    back:function back(){},
    [Symbol.toStringTag]: 'History',
};
history=xuxuwatch({},'history');
Object.setPrototypeOf(history, History.prototype);



Screen=function Screen(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(Screen)

ScreenOrientation=function ScreenOrientation(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(ScreenOrientation)
Object.setPrototypeOf(ScreenOrientation, EventTarget);

function lock(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(lock)
function unlock(){
    if (new.target) {
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(unlock)

Object.defineProperty(ScreenOrientation.prototype,Symbol.toStringTag, {
  value: 'ScreenOrientation',
  writable: false, // 可选，设置为不可写
  enumerable: false, // 可选，设置为不可枚举
  configurable: true, // 可选，设置为可配置
});
ScreenOrientation.prototype.lock=lock
ScreenOrientation.prototype.unlock=unlock
fun_to_native(ScreenOrientation)
orientation={
    angle:0,
    onchange:null,
    type:"landscape-primary"
}
Object.setPrototypeOf(orientation, ScreenOrientation.prototype);


Screen.prototype={
    [Symbol.toStringTag]: 'Screen',
    availHeight: 816,
    availLeft: 0,
    availTop: 0,
    availWidth: 1536,
    colorDepth: 24,
    height: 864,
    isExtended:false,
    onchange:null,
    orientation: orientation,
    pixelDepth: 24,
    width: 1536
}
screen=xuxuwatch({},'screen');
Object.setPrototypeOf(Screen, EventTarget);
Object.setPrototypeOf(Screen.prototype, EventTarget.prototype);
Object.setPrototypeOf(screen, Screen.prototype);



Storage=function Storage(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
Object.defineProperty(Storage.prototype, Symbol.toStringTag, {
    value: 'Storage',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
removeItem=function removeItem(key){
        if(key==undefined){
            throw new TypeError("Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.")
        }
        xuxu_log('localStorage.removeItem=>',key)
        this[key]=undefined
}
fun_to_native(removeItem)
getItem=function getItem(key){
        if(key==undefined){
            throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required, but only 0 present.")
        }
        xuxu_log('localStorage.getItem=>',key)
        if (this[key] == undefined){
            return null
        }
        return this[key]
}
fun_to_native(getItem)
setItem=function setItem(key,value){
    if(key==undefined||value==undefined){
        throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 0 present.")
    }
    xuxu_log('localStorage.setItem=>',key,value)
    this[key]=value
}
fun_to_native(setItem)
Object.defineProperty(Storage.prototype, 'removeItem', {
    value: removeItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Storage.prototype, 'getItem', {
    value: getItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Storage.prototype, 'setItem', {
    value: setItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Storage)
Storage=xuxuwatch(Storage, 'Storage')


localStorage=xuxuwatch({},'localStorage');
Object.setPrototypeOf(localStorage, Storage.prototype);


sessionStorage=xuxuwatch({},'sessionStorage');
Object.setPrototypeOf(sessionStorage, Storage.prototype);


XMLHttpRequestEventTarget=function XMLHttpRequestEventTarget(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
Object.setPrototypeOf(XMLHttpRequestEventTarget, EventTarget)
Object.setPrototypeOf(XMLHttpRequestEventTarget.prototype, EventTarget.prototype)
Object.defineProperty(XMLHttpRequestEventTarget.prototype, Symbol.toStringTag, {
    value: 'XMLHttpRequestEventTarget',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(XMLHttpRequestEventTarget)

XMLHttpRequest=function XMLHttpRequest(){
    this.onabort=null,
    this.onerror=null,
    this.onload=null,
    this.onloadend=null,
    this.onloadstart=null,
    this.onprogress=null,
    this.onreadystatechange=null,
    this.ontimeout=null,
    this.readyState=0,
    this.response="",
    this.responseText="",
    this.responseType="",
    this.responseURL="",
    this.responseXML=null,
    this.status=0,
    this.statusText="",
    this.timeout=0
}
Object.setPrototypeOf(XMLHttpRequest, XMLHttpRequestEventTarget)
Object.setPrototypeOf(XMLHttpRequest.prototype, XMLHttpRequestEventTarget.prototype)
Object.defineProperty(XMLHttpRequest.prototype, Symbol.toStringTag, {
    value: 'XMLHttpRequest',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(XMLHttpRequest);

Object.defineProperty(XMLHttpRequest.prototype, 'DONE', {
    value: 4,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'HEADERS_RECEIVED', {
    value: 2,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'LOADING', {
    value: 3,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'OPENED', {
    value: 1,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'UNSENT', {
    value: 0,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","onreadystatechange_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","onreadystatechange_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "readyState", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","readyState_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "timeout", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","timeout_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","timeout_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "withCredentials", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","withCredentials_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","withCredentials_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "upload", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","upload_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseURL", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseURL_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "status", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","status_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "statusText", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","statusText_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseType", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseType_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","responseType_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "response", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","response_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseText", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseText_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseXML", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseXML_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "UNSENT", {configurable:false,enumerable:true, writable:false, value: 0});
Object.defineProperty(XMLHttpRequest.prototype, "OPENED", {configurable:false,enumerable:true, writable:false, value: 1});
Object.defineProperty(XMLHttpRequest.prototype, "HEADERS_RECEIVED", {configurable:false,enumerable:true, writable:false, value: 2});
Object.defineProperty(XMLHttpRequest.prototype, "LOADING", {configurable:false,enumerable:true, writable:false, value: 3});
Object.defineProperty(XMLHttpRequest.prototype, "DONE", {configurable:false,enumerable:true, writable:false, value: 4});
Object.defineProperty(XMLHttpRequest.prototype, "abort", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","abort",arguments}}.f;Object.defineProperty(f,"length",{value:0});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "getAllResponseHeaders", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","getAllResponseHeaders",arguments}}.f;Object.defineProperty(f,"length",{value:0});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "overrideMimeType", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","overrideMimeType",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "setAttributionReporting", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","setAttributionReporting",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "setPrivateToken", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","setPrivateToken",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});


XMLHttpRequest.prototype.setRequestHeader=function setRequestHeader(){
    // console.log('setRequestHeader', arguments)
    debugger
    if (arguments[0]==='cw2qEsfh'){
        window.xhrhead=arguments[1];
    }
}
fun_to_native(XMLHttpRequest.prototype.setRequestHeader)

XMLHttpRequest.prototype.open=function open(){
    debugger
    window.url = arguments[1].split('cw2qEsfh=')[1];
    return arguments[1]
};
fun_to_native(XMLHttpRequest.prototype.open)

XMLHttpRequest.prototype.getResponseHeader=function getResponseHeader(val){
    debugger
    if (val === 'content-type'){
        return 'application/json; charset=utf-8'
    }
};
fun_to_native(XMLHttpRequest.prototype.getResponseHeader)

XMLHttpRequest.prototype.send=function send(){
    // console.log('send=>', arguments)
    debugger
}
fun_to_native(XMLHttpRequest.prototype.send)


style={
    accentColor:"",
    additiveSymbols:"",
    fontVariantNumeric:"",
    length:0
}
Object.setPrototypeOf(style, CSSStyleDeclaration.prototype);


getBoundingClientRect=function getBoundingClientRect() {
    // html 元素通常占满视口，宽高接近窗口大小（略加随机偏差）
    const viewportWidth = 1536;
    const viewportHeight = 816;
    const left = 0;
    const top = 0;
    const width = viewportWidth * (0.95 + Math.random() * 0.1); // 95%-105% 视口宽
    const height = viewportHeight * (0.95 + Math.random() * 0.1); // 95%-105% 视口高
    const right = left + width;
    const bottom = top + height;
    const x = left;
    const y = top;
    return xuxuwatch({
        x, y, width, height, top, left, right, bottom,
        toJSON() { return { x, y, width, height, top, left, right, bottom }; }
    }, 'html_event_res');
};
fun_to_native(getBoundingClientRect)

html=xuxuwatch({
    'style': style,
    'tagName': 'HTML',
    selenium: null,
    driver: null,
    webdriver: null,
    onresize: null,
    getBoundingClientRect:getBoundingClientRect,
}, 'html')
Object.setPrototypeOf(html, HTMLHtmlElement.prototype);


base0=xuxuwatch({
    'tagName': 'BASE',
    href:'https://ganghang.gdtspace.com/',
}, 'base0')
Object.setPrototypeOf(base0, HTMLBaseElement.prototype);

head=xuxuwatch({
    'tagName': 'HEAD',
    selenium: null,
    driver: null,
    webdriver: null,
}, 'head')
Object.setPrototypeOf(head, HTMLHeadElement.prototype);

meta0=xuxuwatch({
    'parentElement': head,
    'parentNode': head,
    'http-equiv': 'http-equiv',
    'tagName': 'META',
    selenium: null,
    driver: null,
    webdriver: null,
    name: "translations",
    content: "text/html; charset=utf-8"
}, 'meta0')
Object.setPrototypeOf(meta0, HTMLMetaElement.prototype);

meta1=xuxuwatch({
    id: 'k5ylogNx1ksA',
    'parentElement': head,
    'parentNode': head,
    'content': content,
    'r': 'm',
    'tagName': 'META',
    name: 'analyticsdata'
}, 'meta1')
Object.setPrototypeOf(meta1, HTMLMetaElement.prototype);


rsts=`$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=71815;$_ts.cd="qJSJrpQlxAVqH1gmHqqmraVlHsWZqqVcrAWNWaVDH1gkHqqmrqVmHsW5lpWhrkWmrk0XrsaqrAEmqn9uHqqmqAVDHsWmrr9EHqqpqGVkHsWmqp9mrAAehGVZmqVcifV3JSWWrcGmrO0XqSllDAGZqqVcrAWeWaVrDAGLqqVorAAeWuaqrAEmqu0ulAlskAA-HqqmrqVmHsWZqcgYkGVcDAGZqqVqrAleWaVsDAGZqqVmrAEeWaVqrAlgraglEkaqrAlmrO0uHqqmrrlmHsWmqk0XrsaqrA3mru0vrAAshNGTJaQ0WuA98dxiFmvY5WumCz_cR7QHaTbfJXRqwI0a0nzRPH6gsUlBfJQSjKwICcjc3KEtBIqrbGE7fRSQInijVTRV80NmAHq_s9wXHvJznlrcsOmqxOBrKkWNEcVLWQw8hnwiW9NV_vrhJbr3IssBV2w-1vqe1MwPEseRUkAzXclBJmeF8160wbeNh2SIWMRzwb2XtCN0ebZBF6w-Fc60wbeNUnzIWMRzwb2XtTeFXc0NxnyuwvsdU2gNKYabU4Y9F6ejtDYSZnaftURTQKsoUPe-wCzLUWw8c3ACMVSqTCpJATlZ3viPMkNN3YAdRemN86S9F0E_TmwiRmmYWK8fJ0VSWDr8wj0gWKprVTwh5TYvRk7dHTUWsuYcMkxWWHyiRuymFbfp_9wxYsmSYDtfJvwbJTyvQQ2RRsRVtsV6-sVCWKWNMvtfWKY7W6eKiJ2zwlTitsV6-sVCWKWNMvtfYbETMsRkMjz-89xGtsV6-sVCWKWNMvtfKYxO8vmYY_eLWDwWtKynLsY0wbyTWTkEsYYKiOS7pBf0AOR71lfkdoWg3CRfVKB8JDeTFCzoiXTXsOx_HvmPTTJB31aCWOF7JOw9hDT6izGnw2wNYUq6e2wSHcaCWOF7JOw9hDT6i7f71oYGwCmleKz1I1aCWOF7JOw9hDT6iz34WKmUV0NL-9pURO2TUvUSJlSxpkY1W_7kqOVkJfrN4vwuwOGuJODPWkAuJslSi_g6WqWuWsW6-uQqJkA0kOcjJkQniuQaWFLtJsAaWuq6jkW4mRaljRDXHo2FctIWsiCV2E01P1OqmSf0wDEDvGtRrGlcrP81Z1Bv0EcpXcRQkHhMS6to7lnwgLTphU1l4v4CgrVwiGaa-sW0JkqCWGc-csEnJklTJFE_JsqcraAqjGE0fC7aIP643bqN3CNChIzuFc2OwD9z56YjtKrbMn6g3vQN3DyjhIfXQn2GIs3z51eGRDq-RCsghCrG3oZL3BYXhCRzFKxLd1eGwUE-R6hNhCrCwczG3igBRC2XtCr7d1evFbl-3D4y8nefMUWLRHwBhCrzQnf94PebIKQ-3b64hCYN31zPM8aBRKN7tCxXeoQB3CTutDM531ePFbGLRBJ2hCxgtCSz_Pe-wUE-MoUyhCzSQbR6QXTvhCSfFcfLeDqBMDSftDO0FPe7MoALFiNPhCSSFcf-56lBMCJSR16aQCRPhbT0R-RNQc2LwDzBzbejRny-FCFCMOw9hbN2QMRXRuqXFbT2zbyjFcyjM68CMbSfhbN-w4RXQu3XFvATzbyuRcyjwDsehCyTR1zNQ8LBMvR-tCNLePe7RCG-FChPhCSPR1z-MIGBMD2vtCzTdce7QCW-wDkNh6Jb36QLQIy2h6Y2FPfSZCqBwKyXtooCFvrShvwjR-RuQCGXw6pnzvJuQ1y6woUPh6JCRPz08hRu8b3XwbwX4slBwDzftokX8ne63nzC3HQBQKpat6R9d1eS3ol-wbnCQKyu3czCwIaBQUmBwnfn5DZBwbpdtohn3PeCFb3Th827h6RuFnfn4DABwvYbtohzR1eC86ALwIzSh6mOI1fTdU9BQKzftoUuRKVNwbfCQdezwn2CQCEz4vz6tUp03c67QoqNwopuh8S4Rn2TRv3z4KxTtUYPRbnCwDRvQPzuMH7BwDf0t6JXdDVBQbTf3OiCwoJChvebMhR4M63XICfngPe4FDg-Ioo6h6zCMPzZ84Ryh6e-waAmS1wXpaR3EDhLrTafUYVqU-yQsaQSJAVSbuEcJqEorqDIJsWTWOQrJj74WOqcrOVqjnJGWsVdJOoy3sA6ROZ6itanJCRG3KE6-k3nWsVTHkiz3G";if($_ts.lcd)$_ts.lcd();`

script0=xuxuwatch({
    'parentElement': head,
    'parentNode': head,
    'type': 'text/javascript',
    'charset': 'utf-8',
    'src': 'chrome-extension://olofadcdnkkjdfgjcmjaadnlehnnihnl/build/hook-exec.js',
    'r': 'm',
    'tagName': 'SCRIPT',
    id:'',
    selenium: null,
    driver: null,
    webdriver: null,
    text: '',
    innerHTML: '',
    innerText: ''
}, 'script0')
script0.__proto__ = HTMLScriptElement.prototype

script1=xuxuwatch({
    'parentElement': head,
    'parentNode': head,
    'type': 'text/javascript',
    'charset': 'utf-8',
    'src': "/TVL6Gn5H1dMd/2fi1xR9CnwHL.167654a.js",
    'r': 'm',
    'tagName': 'SCRIPT',
    id:'',
    selenium: null,
    driver: null,
    webdriver: null,
    text: rsts,
    innerHTML: rsts,
    innerText: rsts
}, 'script1')
script1.__proto__ = HTMLScriptElement.prototype

document=xuxuwatch({
    documentElement:html,
    visibilityState:'visible',
    body:xuxuwatch({
        i:0,
        childElementCount:60,
        onclick:null,
        onsubmit:null,
        onmouseenter:null,
        tagName:'BODY',
        style:xuxuwatch({
            [Symbol.toStringTag]:'CSSStyleDeclaration',
            textAlignLast:'',
            lineBreak:'',
            minWidth:'',
            backgroundBlendMode:'',
        },'body.style')
    }, 'body'),
    webkitHidden:false,
    hidden:false,
    head:head,
    onmousemove:null,
    onselectionchange:null,
    characterSet:'UTF-8',
    charset:'UTF-8',
    cookie:'',
}, 'document')
document.scrollingElement=document.documentElement;
document.body.__proto__=HTMLBodyElement.prototype;
document.body.style.__proto__=CSSStyleDeclaration.prototype;
document.head.__proto__=HTMLHeadElement.prototype;
document.__proto__=HTMLDocument.prototype;

document.all=undetectable;
document.all.__proto__=HTMLAllCollection.prototype;
document.all[0]=html;
document.all[1]=head;
document.all[2]=document.body;
document.all[3]=meta0;
document.all[4]=meta1;
document.all[5]=script0;
document.all[6]=script1;

window.window=window;
frames = parent = globalThis = self = top = window;
window.clientInformation=navigator;
document.location=location;
document.defaultView=window;

// 删除本地特征
delete WindowProperties;
delete WEBGL_debug_renderer_info;
delete getExtension;
delete webdriver;
delete connection;
delete Buffer;
delete VMError;
delete window.orientation;
delete clearImmediate;
delete global;
delete setImmediate;

exports=undefined;
module=undefined;
require=undefined;
__dirname=undefined;
__filename=undefined;
arguments=undefined;


// 报错处理
Error.prepareStackTrace=function prepareStackTrace(error, structuredStackTrace) {
    return `${error.name}: ${error.message}\n` + 
        structuredStackTrace
            .filter(callSite => !callSite.getFileName()?.startsWith("node:")) // 过滤掉 node:internal
            .map(callSite => `    at ${callSite.toString()}`)
            .join('\n');
};
fun_to_native(Error.prepareStackTrace);


// 清除执行代码前的控制台日志
console.clear();
(function () {
    'use strict';
    var cookieTemp = "";
    Object.defineProperty(document, 'cookie', {
        set: function (val) {
            cookieTemp = val;
            if (val.length > 200){
                // xuxuxuxulog(val.split('CKvDhNH2GZibP=')[1].split(';')[0], val.split('CKvDhNH2GZibP=')[1].split(';')[0].length)
                // debugger;
                if (val.split('CKvDhNH2GZibP=')[1].split(';')[0].length === 513 || val.split('CKvDhNH2GZibP=')[1].split(';')[0].length === 492){
                    debugger;
                    window.clearAllTimers();
                    cookieTemp = val;
                    window.done = true;
                }
            }
            return val;
        },
        get: function () {
            return cookieTemp
        }
    });
})();

$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=18465;$_ts.cd="qtwSr1qlDP3DtkgkxGVLHGEsqclimrWqxGEnqnGuxGlWmqAGlaqbq13DHkWbr1G5qfWqxGWbqcGulSAbrP3otkWbrqaYrcVsqc3AxGVLWn3qtkgmxGQLHGAsmc3mxGELWSWqxGqbq1GuEflWmGAIxGALHGVsqclimn3stkgllaqbr13ctkWbq1G5mPEmkrQlDrWqxGqbq1GulSAbrn3ltkWbqnG5rc3qUuiIJsADJkW0jtVjjcrffTzY36JloSXTnOM0aS9fVBdi7R8OVSHYWVHadsjPZEexTY1tlm66q75PqR0Eh6YSw6w946Y2wPClK2-bEVJ8huQ03Bx-AbY0WmS6CV90AkJjIVcdiYzIWP7bE4l_UY9XxV2p7kRs3Yx7sDHIYlxpp2J2YZf21bVGHYeF-1ZPxPgaKYnSEUlSWYwss8wfFbe0w12b_2J0pup2VlcdiYzIWP7bE4lnWm2ItnRC0K2bs9rAUkIyp6mAVmf73jpNJYmuxsyFSOW7xPq-HmuqIPSIK1VTE4lftoJTQmfw7nLdRCmP3Kh5FbJ3UP2-QdLfhc3CWuQO7YGatcq2tkoqUPSIEk3bhMZ-w6JTKTGBzkSORCwPRCh03mS3hDfCR-ZBEOqCJc3zSOW7xPq-JYuqhT7bWnVLE4Y0w6J8KnLLLbrO3Kw9RCO5UTajMUYOE4lfJkqSx1fF-cZPKPTjtniSWYTRh2abWhZBEPLLKTGB4bNX3CyPQCOuRCeuhDpjE4lfJkqSx1fF-1ZPxPg0KYnSKcETEc7bh4wIUcNSMbNbZKR6MKSOF6Fu3DgbhPVaJFgfhmZutn3X4orawCwTQbsBE1aaUTLLK-ZnEPGGt1ywa1TuMKSGFDsjFbyGMUqj3BWfhc3CWuQO7YGStcqLwD4XwDYbQKxCwdfSEPG6K29zSPlSxPg2tPBrUny6FC2OMIf0FKNbFoWBdb0PtcquWktdhT7ThPYFtQmIh6wOwow946Y2wvyMKc40MURawKxbQBfSwbma8Tfw7bT2FUm03UH-RvxgU27-M5T6Q6wvwUx94nLPtkpFKYnSKm70hb2SMIlBMvmXFnfB_De7tDSnFD6qhT70hb2SMIlBMvmXFnfB_De7tDSnFD6qhT70hb2SMIlBMvmXFnfB_De7tDSnFD6qhT70hb2SMIlBMvmXFnfB_De7tDSnFD6qhT7Th2SIEZW7QUwnwDmu_CRnxPyfRK6XR2TRhb2SMIlBMvmXFnfB_De7K1yQJ16DKcxFhUw-QXNb3vwvwUx94nl73bJ-wCsqUPSjwCzLhIJCMDGXFUmzZYg7UuE-FvsSMnSjwCzLhIJCMDGXFUmzZYg7UuE-FvsSMnSjwCzLhIJCMDGXFUmzZYg7UuE-FvsSMnSjwCzLhIJCMDGXFUmzZYg7UuE-FvsSMnSjwCzLhIJCMDGXFUmzZYg7UuE-FvsSMnSjwCzLhIJCMDGXFUmzZYywKAPDWDdERT2iW0TziBy0WvYowDxNN9Sjwupu3oMBikxHQTrP3J2iiTS7FowXTVNnH0mWQ9UTsVGCpYTz3_RRATYuWlx4_DzaJsqZVsMyMYYsRvR7A_S_i0RpwUWndvrmYVTYwc5NJCAnRCVnhdwaiCzsHOY4ClfTHUfxWc5NJCAnRCVnhdwai0wGY9rC4OrtJCZ63n5NJCAnRCVnhdwai0TCsDmLZvE6WsYkRnd6QkzkMbYfWXStYby3pYq_C9w6slJ7skUUFmNEiKxNRHgaVK9asUyN5ufXJDm6HD-lp9fOwV0jJF2vJbmGW1N-4OfCA0wepvHB1kJXYo0jJF2vJbmGW1N-4OfgVUl0YUMI8TpCw99jJF2vJbmGW1N-4Of-WUz-FCMs8umBQV3dw8eRFVYA30J2ymxPrqWCrs8kF6paQvA5I4WNUcNSMbNbZKR6MKSOF6Fu3Dg5JOW6r_96RkxvRAQ6jOQtJsEaWkF9WuAaWGgnWtZaJu3CHuAp2SqgOnzMW4KYCUjRTpNobL0zv1qAamJraAtwraEkrGFREdSUF-q5OmIcHA45VGYt7GzevS2MEzQujXAXW1jp_kNmcsVnJsaSjOqnJaW6kOcjJk90JsETJtALAsSTYDzgdmYTJmmnQ9sR3Yxkw0LZUBrQ36aTsYmyjDwJFb293UiNhb2hYqQlqt0cJg3tWogzdDxOtDJjwP6ZQD0L36mzhIePFnfGRvqzdCyatDrXFP65hCJ23czvQXgB36w0tCwXZceOwoE-3DkNhCpLMPzGMBgBRDzCtCrXdv773UNPtDsnwnSPMb3LRdmGhDxzF1fvZvQ73bTNQc6_RCELRKyPhINyhDJjFcfNZUW7Mox6tDvN3cSz3KGLFHJjhDT731fLZ6q7MUmLtDBXhCN2QczXQILBFvpv3cf-4bSXtDfbQbcSMC2bhbz-R-mX3UAXFbT27KyaWcyjwDcSMOp2hbN0W-mXQDWXFbe67KyB3cyjF68SMb2NhbN0QMmXQC0XFvp95PeBRbG-FCh2hCeOR1z-MIZBMCfvtCzT5neaI1y6IKtSQCm6hvwOMhmuQD9Xw6pn7UJaQcy63D8SQ6ra8Pz0MdLBQDTft6pzeceawC3-wKO4h6ma8PzC3hmSM1faRb9z4CyCRPyT3KFSQKY6hvYaR4mS3U3XwD7z4bm7tomfIc6XwDlLQUrPh8yTRnfSIvQz_KxntoRbIP6NFb3LwbyPR4m6M6Ra3bNT7UwgQcyuQD8SwUJGhvm6Q-mTQ6WXQUS27UpB3bA-QC44RsELwKNnh8NX31fTRvEz_vJutoN2F162QC0L8bz6h8YBQ6aXI6wz7UzzFcyetoB0QnS2QbaLQImjQ6qXMvpG7UwvIPy6RCkzhCYNMGQqU-221qrwECJ3bYa9Fo7kKnUawaWTWuZDJjAcWAVuraArvA3CJkE6Jq17iuAnJaQmJRauqq06JO0SjO3CWOAorsl";if($_ts.lcd)$_ts.lcd();
if($_ts.cd){
(function(_$b0,_$$9){var _$d0=0;function _$_i(){var _$n4=[21];Array.prototype.push.apply(_$n4,arguments);return _$aO.apply(this,_$n4);}function _$my(_$_m){return _$_i;function _$_i(){_$_m=0x3d3f*(_$_m&0xFFFF)+0x269ec3;return _$_m;}}function _$$s(_$_i,_$ea){var _$km,_$lo,_$gN; !_$ea?_$ea=_$kG:0,_$km=_$_i.length;while(_$km>1)_$km-- ,_$gN=_$ea()%_$km,_$lo=_$_i[_$km],_$_i[_$km]=_$_i[_$gN],_$_i[_$gN]=_$lo;function _$kG(){return _$nK(_$_z()*0xFFFFFFFF);}}var _$ea,_$km,_$_8,_$$K,_$ke,_$$8,_$lK,_$_z,_$nK,_$o0,_$a2;var _$aq,_$_C,_$_S=_$d0,_$_q=_$$9[0];while(1){_$_C=_$_q[_$_S++];if(_$_C<12){if(_$_C<4){if(_$_C===0){_$ke=window,_$$8=String,_$lK=Array,_$ea=document,_$_z=Math.random,_$km=Math.round,_$nK=Math.floor,_$o0=Date;}else if(_$_C===1){ !_$aq?_$_S+=2:0;}else if(_$_C===2){_$aq= !_$o0;}else{_$aq=_$a2;}}else if(_$_C<8){if(_$_C===4){_$_8=[4,16,64,256,1024,4096,16384,65536];}else if(_$_C===5){ !_$aq?_$_S+=0:0;}else if(_$_C===6){_$a2.lcd=_$_i;}else{_$aO(21);}}else{if(_$_C===8){return;}else if(_$_C===9){_$_S+=2;}else if(_$_C===10){_$a2=_$ke['$_ts'];}else{_$a2=_$ke['$_ts']={};}}}else ;}


function _$aO(_$ci,_$nD,_$kW){function _$_i(){var _$$_=[73];Array.prototype.push.apply(_$$_,arguments);return _$a4.apply(this,_$$_);}function _$k7(){return _$j$.charCodeAt(_$ac++ );}function _$lQ(_$_i,_$ea){var _$km,_$lo;_$km=_$_i.length,_$km-=1;for(_$lo=0;_$lo<_$km;_$lo+=2)_$ea.push(_$bH[_$_i[_$lo]],_$$g[_$_i[_$lo+1]]);_$ea.push(_$bH[_$_i[_$km]]);}function _$cP(){return'\x74\x6f\x53\x74\x72\x69\x6e\x67';}var _$ea,_$km,_$lo,_$gN,_$kG,_$d0,_$_S,_$aq,_$n4,_$_C,_$_q,_$aF,_$pG,_$aE,_$dm,_$kD,_$bU,_$$g,_$mH,_$j$,_$iT,_$ac,_$$6,_$a0,_$bH;var _$i3,_$$L,_$lV=_$ci,_$nl=_$$9[1];while(1){_$$L=_$nl[_$lV++];if(_$$L<97){if(_$$L<64){if(_$$L<16){if(_$$L<4){if(_$$L===0){_$lo=_$k7();}else if(_$$L===1){_$i3= !_$bH;}else if(_$$L===2){_$i3= !_$ac;}else{_$i3=_$ke.execScript;}}else if(_$$L<8){if(_$$L===4){_$lo++ ;}else if(_$$L===5){_$_S=_$k7()*55295+_$k7();}else if(_$$L===6){_$_q=_$n4.join('');}else{return new _$o0().getTime();}}else if(_$$L<12){if(_$$L===8){_$km[5]=_$aO(19)-_$ea;}else if(_$$L===9){_$i3= !_$$6;}else if(_$$L===10){_$a0=_$k7();}else{_$i3= !_$dm;}}else{if(_$$L===12){_$bU=_$my(_$kD);}else if(_$$L===13){ !_$i3?_$lV+=12:0;}else if(_$$L===14){return _$km;}else{_$km[_$kG]="_$"+_$ea[_$lo]+_$ea[_$gN];}}}else if(_$$L<32){if(_$$L<20){if(_$$L===16){_$aE='$_'+_$aE;}else if(_$$L===17){return;}else if(_$$L===18){_$mH=_$a2.aebi=[];}else{_$a2.scj=[{"xmlhttprequest":0,"img":2,"script":2,"image":2,"link":2,"fetch":0,"css":2}];}}else if(_$$L<24){if(_$$L===20){_$a2.cp=_$km;}else if(_$$L===21){ !_$i3?_$lV+=6:0;}else if(_$$L===22){_$lV+=-5;}else{_$$g=_$aO(0,1150,_$my(_$kD&0xffff));}}else if(_$$L<28){if(_$$L===24){_$i3=_$aq<_$d0;}else if(_$$L===25){_$ea=_$km.call(_$ke,_$nD);}else if(_$$L===26){_$d0=_$k7();}else{_$km=[];}}else{if(_$$L===28){_$kG=0;}else if(_$$L===29){_$ea="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}else if(_$$L===30){_$a4(22,_$n4);}else{_$ac+=_$_S;}}}else if(_$$L<48){if(_$$L<36){if(_$$L===32){_$aO(110);}else if(_$$L===33){_$bH=_$j$.substr(_$ac,_$_S).split(_$$8.fromCharCode(257));}else if(_$$L===34){_$aF=0;}else{_$i3= !_$_q;}}else if(_$$L<40){if(_$$L===36){_$aO(99,_$_q);}else if(_$$L===37){return _$ea;}else if(_$$L===38){ !_$i3?_$lV+=11:0;}else{_$n4=[];}}else if(_$$L<44){if(_$$L===40){ !_$i3?_$lV+=0:0;}else if(_$$L===41){ !_$i3?_$lV+=10:0;}else if(_$$L===42){_$dm=_$aO(19);}else{_$a2.lcd=_$$K;}}else{if(_$$L===44){ !_$i3?_$lV+=-69:0;}else if(_$$L===45){_$gN++ ;}else if(_$$L===46){_$ac=0;}else{_$i3=_$gN==64;}}}else{if(_$$L<52){if(_$$L===48){_$gN=_$k7();}else if(_$$L===49){ !_$i3?_$lV+=4:0;}else if(_$$L===50){_$aq++ ;}else{_$aq=0;}}else if(_$$L<56){if(_$$L===52){_$kG=_$k7();}else if(_$$L===53){_$j$="ưǰΞΟǰၤ\x00醣ā=ā,ā[ā(ā.ā:ā);ā;ā?ā.push(ā(){return ā !ā+ā<ā;}function ā],ā=0;ā),āreturn ā(),ā= !ā){var ā:0,ā(){ā=0,ā&&ā]=ā[30]](ā[13],ā+=ā=(ā[ --ā[32]];ā>>ā++ ]=ā[16]](ā-ā||ā|| !ā();ā));āreturn{ā/ā===ā[ ++ā[16],ā=[],ā++ )ā&ā!==ā[4],ā):ā=new ā){āfunction ā[1],ā>=ā*ā++ ;ā[0],ā>ā=1;ā[60],ā[38],ā[29],ā)ā&&(ā&& !ā];ā(){var ā||(ā);}function ā<=ā!=ā= !(ā[2],ā[54],ā[40],ā[52],ā};ā[3],ā?(ā[35],ā[25],ā[18]](ā[55],ā[8],ā[45],ā[10],ā[52];ā={ā[27],ā;return ā){return ā==ā[42],ā>>>ā))&&ā[22],ā[48],ā[39],ā[33],ā[5],ā[23];ā:0};ā in ā[21],ā[15],ā;for(ā){}ā[50],ā;}ā<<ā[47],ā||( !ā++ ){ā>0?ā[32]],ā[32],ā[18],ā][ā[11],ā[19],ā[34],ā(218,{ā];if(ā[61],ā[58]](ā):(ā++ ]<<ā()};ā[60];ā)return ā[12],ā+1],ā=null!=ā^ā){if(ā|| !(ā={},ā[0];ā&& !(ā[63],ā[31],ātry{ā++ ]^=(ā[6]](ā=null;ā[58],ā[110],ā]):ā[51],ā&&( !ā[22]](ā++ ]=(ā))|| !ā[117],ā-=ā;function ā].ā)/ā=0;for(ā[27]]==ā:1,ā=[];ā},{ā[1];ā[118],ā):0,ā<0?ā[32]]===ā[115],ā[124],ā[86],ā[112],ā[46],ā++ ]^=ā](ā%ā++ ];ā=( !ā[39]](ā[4]]^ā[14],ā[17],ā[36](ā});ā,0,ā[47])&ā,true);ā[92],ā[8];ā[30],ā[113],ā|=ā[597](ā[31])&ā=[];for(ā[66],ā]===ā[62],ā;}}function ā[100],ā[52]),ā[47]&ā[15];ā[11][ā[116],ā();}function ā>0;ā);if(ā[77],ā()[ā[9][ā(0);ā[32]]>ā[32]]-ā[31]&ā[96],ā)if(ā[62](ā({ā];}function ā)?ā[43],ā[28],ā[85],ā[41],ā[19])&ā[41]][ā[120],ā[84],ā))&& !ā={};ā:0;ā[119],ā()];ā[55]](ā++ ,ā[162],ā;if(ā:0},null);ā=1,ā[47];ā[159],ā[83],ā++ ),ā);return ā[23]||ā[10](ā[32]]-1;ā[32]]);āreturn(ā[1]&ā[40];ā[32]]/ā({},āfor(ā[68],ā[109],ā[189],ā[53],ā[78],ā= !( !ā; ++ā[28](ā.y-ā+=1,ā=[ā(588,ā-1],ā());ā.length;ā[37];ā[173],ā);function ā[167],ā.x-ā[65],ā[101],ā[6],ā:0},ā);}catch(ā=((ā(1401)-ā[12]](ā[182],ā((ā[18][ā=0;if(ā[7];ā]],ā[55]();ā]-ā)[ā))||ā[150],ā[88],ā[183],ā[36],ā[71],ā[75],ā++ ],ā[102],ā[95],ā]);ā[60]||ā++ )if(ā,1);ā+2],ā[107],ā);}ā[47]](ā[41]];ā)&&ā[10];ā=true,ā[4]);ā[191],ā(1401);ā[44],ā=this.āfor(var ā.x*ā[121],ā[(ā)){ā[141],ā+=1:0;ā.y*ā[56],ā[52]?ā[76],ā:null,ā,{ā[28]== typeof ā[64],āreturn;ā[139],ā){}}function ā(607,ā[21];ā[31];ā[46]+ā)<<ā[74],ā[104],ā[97],ā[140],ā ++ā,1,ā[114],ā]|ā=0:ā]<ā)+ā[4][0];ā[6]](0,ā[11];ā[16]]({ā[9],ā[7]);ā[51][ā+=1;ā++ ):ā()),ā[152],ā[82],ā[124]];ā[46]),ā[147],ā[14];ā[172],ā[37],ā[17](ā[93]];āreturn new ā[67],ā-- ,ā[153]*ā[94],ā();if(ā[9];ā], !ā[24]);return ā[63];ā[164],ā[20];ā[31]),ā[17];ā)):ā);}}function ā[47]);}function ā};function ā);for(ā()],ā[40]),ā[19]^ā[4];return ā=0;while(ā]^=ā[29])<<ā[162];ā[15]](ā(839);ā[166],ā[69],ā},ā[151],ā[155],ā[3];ā[25][ā[41];ā[17])<<ā[13];ā;)ā(1,ā[93],ā=0:0,ā[57],ā:{ā[26];ā[6][ā[6];ā(809,ā;){ā+=2:0;ā[157],ā[188],ā;if( !ā))ā)%ā)&ā[4][2];ā===0?(ā[47]|ā[47])|ā[28];ā[35];ā[187],ā[122],ā.x)+(ā[170],ā[10]);}function ā[19];ā[4];ā[4]&ā[37]&&ā[45][ā[49],ā[69]](ā)||ā:0;return ā[46]);ā[8]),ā[30].ā[20]);ā(599,ā[111]);ā[8])&ā=0===ā[31])|(ā=null==ā[190]]=ā[40]?ā[48]+ā[48]=ā[158],ā[32]]?ā[32]]+ā[32]]%ā||0;ā+1])):ā+2])):ā[101]];ā[80],ā.x,ā[125]+ā[125],ā[31]);ā)),ā[105],ā.y),ā:(ā[105]](ā||0);ā>0?(ā[178],ā[52]*ā])):ā[61]?ā[91],ā[91]+ā[72],ā[177],āreturn[ā);}}catch(ā[29]),ā[119]+ā[14]](ā)/(ā[4][1];ā+=5:0;ā]=(ā[60]^((ā[25];ā[171]))+ā-=3,ā[46];ātry{if(ā-- ;ā+=7:0;ā=null,ā]!==ā[152]];ā);else return ā.length,ā)===ā[80]](ā+=0:0;ā[179],ā[57];ā)|0,ā[140]);}function ā= void 0===ā[2]?ā);return[ā[38]](ā[19]]^ā]^ā):0;return ā]:ā]/ā).ā[15]);}function ā[154],ā-=4,ā]=113,ā.slice(ā[47]^ā[38]](null,ā[60]?ā:[],ā():0,ā.join('');}function ā+=-9;ā[139]);}function ā-1),ā; typeof ā,this.ā[38]);ā[121]);}function ā[4]]<<ā]),ā]).ā[60]),ā[21]);ā[142],ā){ typeof ā[193],ā-=2,ā-1;ā[184],āreturn((ā[4]?ā[0][ā[160],ā[83]?ā[19]);ā[161],ā&& !( !ā[4]],ā[150]](ā('');ā[40])]))&ā[7]);}function ā[103],ā:0});ā[6]](0),ā[194],ā+1)%ā[181],ā[181]+ā[40]];ā+=(ā[68]);}function ā[220],ā[143],ā[224],ā[182]);}function ā[208],ā[8]);ā[175]);}function ā[37]?ā[143]);}function ā[38];ā[38]/ā[30];ā[35]);ā+1]=ā[143]+ā[40];for(ā();for(ā[28]);ā[4])|ā)),{ā= ++ā[90]);}function ā]+=ā[157]];ā[17]],ā: -ā[195]+ā[53](ā[195],ā[7])+ā[235],ā[215],ā[136]);}function ā[26]][ā[252],ā[84]);}function ā[1]?ā.y)/(ā[1][ā[1]^ā[33]](ā[20]*ā[168],ā[12]]());ā[117]);}function ā[64]][ā[130],ā||0,ā[27]];ā[26]](ā[((ā()*ā[100]];ā;try{ā[19])|(ā.x+ā++ ]^=((ā=false:0,ā(384,ā[14]);ā);else if(ā[68]][ā[137]],ā[43]);}function ā)?(ā[4][2]));ā[106]];ā[47]);ā[221],ā+=6:0;ā[32][ā[32]+ā[39][ā.y;ā[190],ā[39]=ā(757,ā[39];ā);while(ā[65]]();ā[12];ā[7]&&ā[227],ā))return ā[173]];ā[179]][ā[37]|| !ā[118]][ā)>=ā?0:ā+1]&ā[114]);}function ā[202],ā)||(ā[112]),ā[12]];ā[61]);}function ā[2]],ā[8])[0],ā[233],ā[87],ā[38]]( void 0,ā[169]);}function ā[237],ā[47])),ā)==ā]=\"\",ā[54]](ā+=9:0;ā[10]](ā[56]]();ā[52]],ā[52]][ā[132],ā[29]](ā[136],āreturn 0===ā[89],ā[118]]?ā(434,ā+=-7;ā(218,ā())in ā){return(ā[10]];ā[51]];ā[130]);}function ā[25]);return ā+=4;ā+=3:0;ā[599](ā=false,ā]);else if(ā[104]+ā[24]],ā[127],ā]>=ā[37]),ā[204],ā)!==ā?1:0);ā[0]|| !ā[60]== typeof ā(592,ā[4]);return ā};}function ā];}ā+=5;ā[7],ā[149]);}function ā[98]?ā[77]][ā[70]],ā.x),ā[21]);}function ā[2];ā+=-5;ā[2]^ā[55](),ā[219],ā},null);ā[40])<<ā.split('');for(ā[79],āreturn(new ā+3],ā[16]);}function ā[47]),ā;}return ā[32]]>0;ā[109]);}function ā]]=ā(1554,ā]]:ā[15]));ā[15]||(ā[184]][ā[31]|ā++ ;}ā]);return ā[3]);ā]>ā]+ā[239],ā)*ā[216],ā(754,ā]||0);ā[15]|| !ā[47]+ā[43]+ā[134],ā[9]||ā[23]?ā[23],ā[106],ā[35][ā[35]=ā,'');}function ā[35]];ā[52]||ā[247],ā=[{ā[92]);ā];}}function ā[85]](ā[149],ā):0;for(ā[16];ā(571,ā[81]);return ā===1;ā(430)),{ā={};for(ā+=12:0;ā[32]]>=ā[13]];ā[169],ā[188]];ā!=null?(ā[18]];ā+=11;ā()][ā[129]];ā()*(ā[63]];ā[8]?ā[25])|(ā[32]]-1];ātry{return ā[0]^ā[175]:0,ā[1]](ā[103]](ā)};ā+1;ā())[ā[49]);}function ā[112]+ā[230],ā+=4:0;ā)(ā[0]);ā[59]];ā[45]=ā[207],ā.charCodeAt(ā+=3;ā[52]&&ā[240],ā)return;ā[61]);ā(2159,ā[23])return[ā[42]](ā[30]||(ā(253,ā<<1^(ā[50]+ā(390,ā[600](ā[38](ā[38]+ā()?ā+1];ā()%ā[45]),ā().ā[17]=ā+=-87:0;ā[73];ā[57]===ā[0]);}function ā];for(ā[171]+ā):0):ā[98]:0,ā>1;ā();return ā[120]];ā[183]);}function ā[191]);}function ā[88])>ā||1);ā[4]):ā[113]];ā[135]]({type:ā.z;ā[155]];ā[111]),ā[0]));ā[57])>ā[27]));ānull===(ā[107]);return ā)try{if(ā<=10?(ā(1,0),ā+(ā]=38,ā)return false;return ā[187]);}function ā[231],ā[260]^ā[4];for(ā);if(null===ā(138,ā[132]];ā[177]&&ā[12]]()));ā(1716,ā)):0;if(ā+=36:0;ā[121]),ā[55]);}function ā[138]);}function ā[275],ā[119]);}function ā[75]];ā[9]=ā[6]);if(ā[1]>ā[1]=ā instanceof ā[1]+ā[32]]>0&&ā[145]);return ā];return ā[137];ā[193]](ā[180],ā[37]))|| !ā[110]);}ā;else ā[24],ā[28]];ā[63]=ā[32]]*ā[167]);}function ā[10]])return ā[32]];for(ā[38]&&ā[64]](ā>>>0&ā[3]<=ā[92]);return ā[148],ā(344,ā]||0;ā[18],1,ā[138]+ā[37]](ā[63]&& !(ā(){return(ā>0)for(ā[36]];ā;return[ā:\"\",ā[79]](ā(){return[ā[37]=ā.x;ā(875),ā[176]];ā[105]);}function ā[109]),ā[305];ā[153]},{ā[55]](0,ā[132]);}function ā(867),ā[23];for(ā]=0;ā[13]),ā[200],ā[248];ā[52],( ++ā[29];ā[55]];ā[80]);}function ā))[ā[27]]==1&&ā+3])):ā[14]];ā[4][2]||(ā[22]+ā?1:ā[6]);}function ā[89]),ā[89]);ā[181]);}function ā(1033,ā[177]);}function ā[7]));ā[225],ā[101]);}function ā[59]?ā]!=ā[27]);}function ā[52]^ā+=205:0;ā[149]][ā++ ):0):0;ā.y,ā[36];ā, ++ā[103]];ā[73]);}function ā(1401),ā[52]:ā[52]<ā<=1?(āreturn null;ā[192],ā[316],ā){if( !ā[61];ā[31]^ā++ ;}return ā[178]],ā(1862);ā[4],(ā[165]:0):0,ā()]()[ā[19]=ā[178]][ā[52]?(ā[176]],ā[96]]-ā[180]);}function ā[195]);}function ā[57]&ā[4][2]&& !ā+1][ā[72]];ā[168]);}function ā]>>ā+1]-ā(764,ā[6]];ā[128],ā-((ā[17]((ā[181]](ā[54]);return ā[47])return ā[62]);}function ā[253]&ā[124]);}function ā(1154,ā[15]];ā[32]]:0;for(ā(865),ā[142];return ā[59]);ā[44]===ā[111];ā){this.ā[2]](ā[132]]&&ā[210],ā==0;ā[56]|ā[214],ā[270]*(ā||1;ā[67]](),ā]=108,ā[12]],ā[52]);ā){for(ā[100]),ā[159]];ā[52]];ā[52]]&ā[99]);return ā[258],ā[29]];ā>>>0),ā[3]=ā[21](ā[267],ā[3]+ā[25]=ā[17]);ā[50]],ā>=0;ā[7]&&(ā[158];return ā[3][ā[46]=ā[7]||(ā[21]&& !ā[60])],ā[94]];ā[192]));ā.split(''),ā[13][ā= typeof ā[145])&ā<=85?( --ā[98],ā[99]]==ā]>0;ā[212];for(ā++ ):0,ā[52]==0;ā[18];ā+4])):ā){return[ā[27]]==0?ā[89]);return ā[74]);}function ā(601);ā)!==true?(ā[111]][ā[89]);}function ā[111]];ā[119]][ā+=-10;ā(1434,0,ā(891,ā[40];while(ā[123],ā[108]*ā[176],ā+=1:0,ā[108];ā=2;ā[34]);ā[46]):0);ā=true;for(ā[18]);ā];}return ā[23]!==this[ā[37]|| !(ā[46]):0,ā[4]]]^ā()});ā[48]);}function ā[1]);if(ā]):0;return ā[84]];ā[59]](ā[32]]-1:0,ā(745,ā[1]);}function ā.x&&ā(95,ā[125]);}function ā(525);ā]-=ā)):(ā+=81:0;ā[223],ā[263];ā});return;function ā[57]+ā[174]),ā[160]);}function ā=\"\";ā[23]===ā[26]);}ā[0]||( !ā+=-4;ā[166]),ā()]){ā[128];ā[17]]=ā[95]];ā[90],ā>>(ā);else{ā[151]);}function ā[115]][ā[94]],ā[30]))||ā[98]:ā[36]],ā+=15;ā+=10;ā[185];ā[310],āthrow ā[92]+(ā|=1;ā[259],ā[2]=ā[73]];ā[5]];ā[13]&&ā[26]|ā[1]||'',ā[52]){ā+'\\n'+ā[32]];while(ā[43])>ā[117])>ā+=9;ā[2][ā++ ])&ā[246],ā+1},ā[55]()>ā),{ā[46]*(ā/=ā]]]=ā[13],1,ā+=25;ā[67]==ā[49]);return ā[133];ā[60])),ā[79]);return ā]=1,ā);}finally{ā;}}catch(ā+=14;ā+((ā[294],ā)break;ā[78]);}function ā[74]];ā]%ā[19]](ā]*ā)>ā[25];return ā[133]),ā)-ā(1332,ā[20]](ā[236],ā[57]][ā[88]==ā[157]);}function ā();}ā){}function ā[14]===ā[81]],ā(1685,ā[255],ā+=-132:0;ā[53]);}function ā[251],ā[150]+ā[47]=ā[26],ā[65]in ā+=7;ā(){this.ā[28]?ā[28]=ā}];ā[3])&ā[70]);}function ā[41]);}function ā[60]*ā[4][0]==ā[36]+ā+=13;ā(532,ā=0;}function ā[64]+ā.y))*ā[6]](0);ā[15]&&ā(17);ā)):0;return ā(1888,ā;}if(ā[107]];ā[129]+ā(1001,ā);}}ā.apply(null,ā<=58?(ā+=6;ā[103],0,ā<=52?(ā[179]);return ā[178]);}function ā[174]];ā[11]=ā[19]&ā[20]);}function ā[31]|| !(ā+=188:0;ā-=5,ā[60])|(ā[145],ā[145]+ā[144]);ā[19]]<<ā= -ā[0]);return ā[174],ā[15]);ā[16]]((ā[30]](this,ā)|| void 0===ā[28]);}function ā[194]](ā[110];ā[206],ā[133]);}function ā+=-406:0;ā[245],āreturn[];ā[187];return ā[241],ā[10]);ā[133],ā])/ā[60]);ā[5]);}function ā.y))),ā[158]];ā[21])*ā)>1?ā-1+ā(19,ā[49]|ā[83]&&ā[51];ā[51]?ā[28]!= typeof ā[66]);}function ā===0;ā&& void 0!==ā/(ā[167]];ā++ ])>>>0;ā||0===ā,[āreturn 0;ā]]||ā[55]=ā){try{if(ā[254],ā[250],ā++ :0,ā[119]);ā(){return +ā));}function ā)?[]:{};for(ā[4][0]|| !(ā[135];ā[146]],ā[163]);}function ā()]=ā[5]=ā[0]=ā[0].ā[171]);return ā[32]]-1].ā[118]];ā[4]:0,ā[67]](ā=null, !this.ā+2]=ā[187]];ā[185]);return ā)return 0;ā[203],ā[189]);}function ā[61])|((ā[232],ā[154]);}function ā+=2;ā[35]);return ā[8]];ā[76]]([ā[1]];ā[48]);return ā,1));ā[7]][ā[0]>=ā[19]];ā[44])this.ā[161]],ā[116]+ā[170]);}function ā[28]);}ā+=8:0;ā[52]-(ā]&ā[5]],ā))+ā[185]);}function ā+' '+ā[117]]+ā())>ā[95]),ā()?(ā[238],ā():0;}function ā[32]]:0;ā(1);ā[292],ā[(((ā='',ā&& typeof ā[31]);}function ā[9]);ā[111]],ā[7]|| !ā[19]|ā[3])+ā]):(ā[16]];ā]|=ā[11]);}function ā[58]];ā[21];return ā[16]);ā[141]];ā[32]])===ā(1291,ā[183])!=ā[140]](ā));return{ā=[[],[],[],[],[]],ā=(arguments.length-1);ā[146]);}function ā){return[(ā[40]]^ā]++ ,ā>0,ā[244],ā.substr(ā)|(ā[41]]=ā+=-8;ā= void 0!==ā[190]:0;return ā[10]?(ā[5]);else if(ā+=99:0;ā(569),ā[31]));return ā(569);ā[16]](0);while(ā+=-1481:0;ā(877);ā[126]];ā));function ā[125]);return ā+=1830:0;ā[63]);}function ā[126]](ā[2]);ā;if( !(ā];while(ā[83]);}function ā[54]=ā[54]+ā[31]))||ā!==null&&( typeof ā+=1065:0;ā[93]](ā)||[];else return ā[50]=ā[99])return;if(ā:'\\\\u'+ā[8]):ā[165]](ā[160]),ā[39]);}function ā-52:0):ā[59]);}function ā[20],ā[1].concat([arguments]),ā[186]]:null,ā(292);ā[8]?(ā+=930:0;ā='protocol';ā){return;}ā+=-183:0;ā+=-194:0;ā:0;for(ā.x!=ā]=Number(ā[37]+ā='href';ā[4][0]&& !ā[32]]-1){ā+=1189:0;ā<=115?ā[99]),ā[37]:ā[10]:ā+=39;ā[10]?ā[10]=ā){}else return ā[49]], !ā+=1661:0;ā+=-1264:0;ā[44]),ā):0);else{switch(ā[40])return[];ā.x?(ā[45]);}function ā[0])||0,ā+=-641:0;ā[4][1]&&(ā===252?ā(418)});ā<=92?(ā[190]),ā[38]=ā[48]);}ā[32]),ā+=953:0;ā<=55?ā():ā[84];return ā[97]],ā[148];ā(314);ā[0]===ā=false;break;}if(ā[98]?(ā[185];if(ā[157]),ā()+ā[169]](ā[17]+ā=true:0:0;return ā(),buffered:1});ā[52])];ā[158]]||ā[369];ā=false;break;}return ā[99]]);break;case 5:case 6:ā(1562,ā[166]);}ā?0:(ā>=40&&ā[30]&ā[31]]():ā[7]){return;}ā+=25:0;ā[44]];}ā+=630:0;ā[16],1,ā[40]](this);ā=null):0;}function ā[167]);}ā[113],1,ā[122]);}function ā[20])[āreturn{x:ā[50])))&&ā[41]]=new ā());}ā[153]),ā[17]|ā[75]:0):ā[73]+ā[17]]),ā]);}ā(174)};ā+=170:0;ā[120]+ā+=-1033;ā[22]];ā[39]]);ā<=73)ā[81]),ātry{(ā:null}];ā[65]),ā[4][1])||( !ātry{if( !(ā(1465);ā[28]){ā(1015,ā){ delete ā+=-499:0;ā[175]:ā[81]);ā);}}}catch(ā+=-1383:0;ā){return ! !ā+1))+ā[171],ā;break;}}ā+1));ā[27]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā+=18:0;ā[28])/ā<=98?(ā[28])+ā[154]],ā(2155));ā>1)ā=0;function ā[125]===ā[53]),ā+=-118;ā(869);ā()?this.ā+1))[ā+=171:0;ā[91]),ā(424);ā+=1043:0;ā[86]]=ā));if( !ā+=1121:0;ā[12]])){ā+=996:0;ā[78]&&ā[154]]||1;ā[183]),\"\");ā[86]]-ā[86]],ā()]}};ā()):0;}}function ā[86]]),ā[108]];ā[4]){ā+=-79:0;ā,'');}else return'';}function ā[108]](0,ā[0];}function ā[325],(ā[129];return ā))return false;ā<=90?(ā-1;}}else if(ā[67]]);ā+=107:0;ā[6]],ā(1346,\"ec\",{ā[98]);return ā[0])+ā(1005);ā[46];return ā[125]},{ā[125]!==ā);}return ā,{value:ā[0]=[],ā[3]);else if(ā[193]);}function ā[10]||( !ā[40]& -ā[32]]];function ā[32]])];ā<=23?ā));}return ā[81]*ā[52])[ā[282],ā[6]||( !ā+=70:0;ā-- )ā!=true)?ā[0])|| !(ā=false;for(ā+=998:0;ā[57])+ā+=-1114:0;ā; !ā[321];ā(871,ā(637);ā[4][1]|| !(ā<=83)ā[32]]];}function ā[346];ā+=167:0;ā={};if(ā[23]||(ā[40]+1)continue;if(ā[90]?(ā[54]);ā+=681;ā[201],ā;if(null!=ā>>>1)):(ā[109])?(ā[106]]&&ā+1));}}function ā(1418,ā=1;}}if(( !ā[318],ā<<1)+1,ā?1:0;ā[155]][ā(1307);ā='#';ā[63]||( !ā++ )==='1',ā]-- ;else if(ā!==''){if(ā[363]&&ā-=1):0;return[ā[6]};ā[66]);}ā+=-19;ā[121]},{ā[604](ā()||ā+=253:0;ā(424,ā[32]]===0;ā<=14?(ā[71]](0,ā,0);for(ā[27]]||ā[157]](ā<=16?(ā[1]);else if(ā[161]], !ā[36]),ā[189]),ā++ :0;}return ā(1376,ā[33];return ā):0;}catch(ā);if(0===ā[4]=2,ā+=91:0;ā): void 0,ā[32]]-1,ā=this;try{ā<=12?(ā[58]);return ā[12]);}function ā>>>0);}}function ā[193];}}return ā[194]]=ā+=-444:0;ā(298,ā[133];}for(ā[71]];ā<=69?(ā(1368,ā[30]=ā<=18?(ā+=195:0;ā(891,0,1);ā];}else ā+=330:0;ā+=177:0;ā[108]*(ā[1]):0)||0;ā<=96?( --ā=0, !ā[94]);return ā[3]=(ā(162)};ā[65]);}function ā+=1050:0;ā[272];ā+1],16));return ā<=65?(ā[52]]);ā[29]&ā&= ~(ā[30].cp;ā(416,ā(1364,ā[49]==(ā<=61?(ā(430);ā[48],0);for(ā++ );}function ā='/';ā]);}function ā+=-1453:0;ā){try{ā+=14:0;ā>=97&&ā[127]);return ā[4][2]&&( !ā+=1031:0;ā(567,ā[132]][ā[172]),ā(1465,1);ā[52]&&(ā++ :0;return ā[3]=[ā[172]);ā[175]),ā;while(ā[42];return ā[211],ā[2]);else if(ā[317],ā(863);ā[131],1);ā!==''?ā[43]],ā[152]]();ā+=-1214:0;ā+=-1053:0;ā[41],1,ā[109]]),ā[71],0,ā+=-537:0;ā[0];for(ā[116]];ā[12]);return ā[9]+ā[125]);ā[17],unique:false});}function ā<=17?ā[163]);return ā[125]),ā+=218;ā[49])==ā[94];return ā+=1284:0;ā[32]]=0;ā[40]?arguments[4]:0;ā|=1:0,ā[122];return ā[174]);}function ā[122]),ā[113])||[];return[];}function ā[4][0]>ā[44]];}else return ā+=474:0;ā[135]);}function ā.y>0?ā[120]);}ā[30]&& !( !ā+=-459:0;ā.fromCharCode(255));return[];}function ā):0, !ā[160]},{ā)];}ā[21]];ā];return[ā[40]/ā[5];ā[63]&&( !ā[5]&ā[18]<=ā; --ā[153]];ā[40]=ā+=-638:0;ā[40]:ā[137]+ā(1426,ā[156]);}function ā(791,ā[75]);}function ā[22]){if(ā[27]]){case 0:case 3:case 4:ā=\"10\";ā(2157);ā[40]^ā+=-2049:0;ā[83]+ā[222]:0,ā[351]*ā<<=1;ā[22]);return ā[60]]-ā[60]],ā[48];ā[34]];ā[37][ā++ )this.ā[60]];ā+1,ā[84]),ā=0):ā+=639:0;ā[58])];for(ā(889);ā(1027);ā[32]]==0&&ā],0),ā=[], !ā(863,ā+=78:0;ā[24];ā})):0,ā[24]?ā(494,ā=null;return{ā(1108,ā+=17:0;ā[24]*ā});}catch(ā[359],ā[4][0])|| !(ā<=91?ā[24][ā[164]:ā[98]/(ā[375],ā[187]);return ā});return ā[33]];ā[48]));ā[163]+ā)*(ā[57]='';ā[90]){ā[106]]>0;ā+=35;ā[168]?ā[168];ā[138]);ā[0]),(ā[20].ā[0]!==0?(ā[20]+ā+=48:0;ā[22]]={};ā[168]+ā[8];}catch(ā;else{ā[20]=ā+=1001;ā[10]));ā[32]]<ā[32]]>1?ā[32]]:ā+=415:0;ā[158]);}ā[151]];ā[80]]||ā+=-653:0;ā[28]))&&ā[64]);return ā[293]?ā[4][1]&&( !ā[115]});}function ā[2])+ā[64]];ā[129]][ā[67];ā];}else if(ā[605](ā.x==ā[30]);ā(528,ā[8])||ā[67]+ā[159];return ā+=346;ā(1489);}ā[19]]},ā[3]]!==ā[146]]};ā[108]);ā[43]=ā+=629;ā(705,{ā=window;ā[108])+ā[121]),\"\");ā[16]](0);ā(1405);return ā+=787:0;ā[32]][ā[12]]())[ā[8])|(ā[80]);ā(671);ā=true;}}if(ā[28]:0;ā-1]),ā[1])try{ā[52]==ā<=74)(ā[164]);}function ā+1)];}function ā(271));if(ā+=-1048:0;ā[102]];ā=0):0;break;case 3:ā);}else ā[37])];}function ā(1209,ā<=59?ā+=-1464:0;ā(96);ā)]=1;ā;}}if(ā[44]==ā[44];ā[44])));ā]>>>ā[89]&&ā[154]===ā=[];if(ā[17]&1;ā[32]]);}}function ā[3]);return ā[5]);return ā[70]);if(ā[29]==ā[95],1);ā[15])&& !(ā[25]||ā].y-ā=1;for(ā.y);}function ā[27]]=ā<=82?(ā]+this.ā[26]];ā=parseInt;ā()===ā<=80?(ā<=76)(ā[156]);return ā[37]];ā(859),ā[37]]?ā[1]===0||ā]=0,ā[29];return ā[356]^ā(859);ā[181]),ā[40])):ā<(arguments.length-1);ā<=72)(ā[31]);return ā[47])|(ā[60]===0?ā),this.ā:0:0,ā[324]^(ā[24]]/ā))<= -ā,0);if( !ā[135]+ā[36]]/ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā[27]],ā(1575);ā[24]];ā[21]|| !(ā]++ :(ā[4]):(ā[32]]-1;}return ā[18]);}function ā[79]];ā++ ;}}ā+=-86:0;ā[7]))&& !ā[63]][ā[177]);if(ā[144]*ā[80]+ā<=41?(ā,1):ā[104];return ā[4][2]||( !ā.x<ā+=43;ā[83]],ā[25]];ā[54],0,ā+=1361:0;ā(1434,1);ā[175]]({name:ā[22]],ā[60],[]));ā[2]];}function ā(34);}catch(ā(1366),ā+=-1410;ā[58]);}function ā(412);ā[115]]&&ā(767,ā[56]);}function ā[73])>ā+=18;ā):0;ā+=-1477;ā+=-472:0;ā[46]&& !(ā[144]:ā(170,ā[86]===ā[10],0,ā[52]||(ā[4][2]>ā>1){for(ā-1)))>=ā++ )try{ā[129])+ā=1;while((ā[35]))&&ā[23]))||ā[338],ā],0)!==ā(1334);ā[161]]==ā[124])||(ā(873,ā+=-998:0;ā[114]];ā[25]||(ā[14])/ā[9]<=ā+=-356:0;ā<=51?(ā[32]]};}function ā[35]);if(ā+=-100:0;ā[77]);}function ā<=53?(ā+=15:0;ā[190]](0,ā==null?ā)).ā))(ā(1360),ā=\"6.1\"===ā[2];return ā]]+1:0;for(ā+=-348:0;ā);case'number':return ā[40])),ā(557);ā[13]);ā<=57?(ā[13])>ā(1430,ā[77]===ā()));ā[23]){ā(1403);for(ā[86]]))),ā[21]|| !ā[43]);return ā[49]||ā=\"8.1\";ā[28])continue;ā[2];return[ā|| typeof(ā.x),0<=ā:null};ā[135]),ā[55]]-ā[136]!=ā+=-1260:0;ā(2168,ā.length=64;ā+=-1567:0;ā[186]),ā[111]||ā[27];ā[0]?ā[205]:ā];}catch(ā[205]?ā[190]]||ā,1));}catch(ā+=40:0;ā(196,ā];else ā].apply(ā[68]},{ā=true;break;}}ā[10]&& !ā()==1?ā[7])|| !(ā[23];}function ā[62]);ā+=564:0;ā++ ]= ~ā]||0)+(ā[1]=arguments,ā[19]|| !ā[21]},{ā=false;}function ā[39]);ā+=352:0;ā[39]),ā[229];ā())return 1;else if(ā<=48?(ā[47]);for(ā[68]];ā[0]);else if(ā++ ]= !ā[43]]||ā+=13:0;ā[71]);}function ā<=108?(ā,0);return ā(565,ā[106]](ā<=3?ā(1709,ā].x-ā[89])?ā||1,ā[48]){ā[261],ā+=162:0;ā[28])return[ā(1017);ā[33]]||ā[105]],ā[21]||(ā[60]?(ā<=106?(ā[52]);}function ā[242],ā>=127?ā[12]]()[ā[91];function ā[48]),ā+=-1487:0;ā+=1758:0;ā[115]);return ā]=1;ā]=1:ā<=11?ā[59]:ā+=1117:0;ā[59]=ā[59]<ā++ ;break;}ā++ <ā[4]);else if(ā++ :ā(559,ā(1493,ā[52]]:0):0;return ā[4][1]));ā(1478,ā=this,ā[24]);}function ā);else return[];}function ā[133]];ā[141]+ā[109]],ā[129];ā[329],ā[601](ā+=-570:0;ā[32]]<1;ā[0]>>>0;}ā==0||ā[77])>ā.y<ā[190]+ā[137]),'');}function ā-=1):0,ā.y+ā[132]]>0;ā[77]),ā[36]=ā(2173,ā[56]=ā[56]?ā[264]);}}function ā[56];ā[87]);return ā(1,(ā[35]||ā):0;}function ā[173]));ā[143])),ā(){return((ā[178]+ā[56]+ā[60])<<ā[140];return ā.length===3)return new ātry{for(ā[35]];}catch(ā[30]);}function ā+=99;ā[136]]||ā[17]|(ā[52]+ā+=-435:0;ā)):0,ā+=1192:0;ā[111],1);ā[48]);return{ā<=102?(ā;}else return ā+=-688:0;ā(861,ā)return;try{ā[364],ā))):0):0;}catch(ā+=19;ā<=0)return;ā[31]-ā[163]),ā<0,ā+=568:0;ā.lastIndexOf('/'),ā(670);ā<92?(ā[4]);}function ā[28]]();ā[368];ā<0;ā[70],'');ā(100,ā++ ]= --ā[173]);}function ā[124]],ā+=-81;ā=0!=(ā+=-708:0;ā[34])|((ā[146];return ā[358]],this.ā[32];return ā,info:ā<=44?ā[186]);}function ā+=1259:0;ā);}else{return;}}catch(ā[40];continue;}}else if(ā+=425:0;ā[72];ā++ ]=false:ā+=-1030:0;ā()]));ā==0?ā[99],ā=true;if(ā[6]&& !(ā[41]||ā[35]);}function ā[40]);ā[40]):ā[133]]){ā[91]);}function ā[107])[ā+=-676:0;ā<=95){if(ā[146]+ā-- ):ā(631);ā,warn:ā[103]]=ā(1560,1);ā[52]))&&ā[171];return ā.length===6)return new ā[52];while(ā+=1108:0;ā.length=0,ā(883),ā[32]];){ā]===\"..\"?ā[64]},{ā,' ')),ā[106]===ā[3]>=ā){return false;}}function ā<=37?(ā+=8;ā[44])));return this;}function ā[92]);}function ā+3]));else if(ā+=1068:0;ā[27]);return ā[9]),ā[32],1,ā(268);ā[152]);}function ā[112];return ā(342,ā[47]-(ā<=7?(ā[122]},{ā[284]&&ā[53]);ā[102]);return ā[28]?(ā[27]]);switch(ā(187),ā<=33?(ā=window['$_ts'];ā:true};}function ā[21])<<ā)))<0;ā(1661,ā>>>0;ā[51]?(ā++ ;else return ā[14]){ā[103]),ā[60]:0,ā[152]],ā[44]);ā+=-939:0;ā[4][1]&&ā(573,ā[104]),ā}),ā[2];if(ā[283],ā[33]);}function ā())!==ā>>=1,ā[38]==ā[27]),ā[253];ā(1372);ā[26])!==0?ā[57])):0,ā[57]=ā[147]);}function ā[12]]())!==ā+=122;ā[52])|(ā[43]):0,ā[181]];ā[60]);for(ā+=12;ā[40]]('');ā(418);ā[24])/ā[187]]=ā[319],ā+=111;ā<=27?ā[131]+ā)};}function ā)===0)return ā))return\"\";for(ā[322],ā[157]])return ā[147]]==0){ā[52]));ā[6]][ā[32]]-1)return ā[131]:ā[131]?ā[47];}ā)+1?ā<=47?ā+=-904:0;ā[31]],ā+=-447:0;ā+=196){ā=false;if(ā+=789:0;ā[60])?(ā(172,ā[34]],this.y=ā[8])[0];}function ā[3]][ā(899,ā(982,ā))];}function ā[337]],this.ā+=991:0;ā+=578:0;ā[159]},{ā.x)*(ā[143]},{ā[56])==ā[104]);return ā[66]));}function ā[139]+ā[45])===ā='pathname';ā[193];return ā(412),ā[156]](ā[8])if(ā[162]],ā<=89?ā[272];return ā[68]]||ā(11,ā[104]);}function ā[52]:0,ā[44]]){ā[309])^ā[265],ā[49]&ā+=-820:0;ā[91])){ā[10]((ā[14]]=ā[10]&&ā<=49?(ā=[0,1,ā+=504:0;ā[161]);return ā=1):ā)||0;ā(563);ā[60])):0,ā+=1475:0;ā='\\n'+ā+=116:0;ā<=45?(ā(1104,ā[32]]!==ā[179]];if(ā[111]-ā[28]&& !ā[111]*ā[114]]:\"{}\");ā();}return ā[4]}),ā.y==ā[65]+ā){this[ā;for(;ā[76]);}function ā])):0;return ā++ );return ā[122]]();ā[99]];ā){return(new ā[129])))&&ā[99]]=ā+=-408:0;ā);case'object':if( !ā[56];return ā>1?1:ā[106];return ā[108]);}function ā), !ā>>>1));ā[74]);return ā[98]][ā[8])[1],ā[27]]?ā[11]][ā[135]];ā.y)return true;return false;}function ā+1));else return\"\";}return\"\";}function ā(1224,ā+1];if(ā[12]]=ā(839)-ā[101]];try{ā[40]);}function ā(\"EOF\");ā[67]&&ā=[],this.ā[114]]?ā+=396:0;ā+2);for(ā[164]),ā[54]];ā[229]?(ā.y);break;case 1:case 2:āreturn this[ā(563),ā[4]<<(ā[4]));ā<=114?(ā[257],ā(0,ā='';do ā[185]](0,ā]==ā<=1;ā+=-503:0;ā[96])))&&ā[6],1,ā:null},{ā++ ;for(ā[93]);return ā<0?1:0;ā[131]]();}catch(ā+196));}ā[90];ā+=97:0;ā=0;}catch(ā[10]]=ā(841);ā]!==null&&ā]]:(ā[147]]=ā[147]];ā[30].jf=ā[132]?ā[30].jf;ā[131]);ā[284]||ā<=56?(ā]=[ā+=-823:0;ā.length===7)return new ā;'use strict',ā+=1194:0;ā[136]+ā]||1)ā(5);ā[21]:ā===0)return[];return ā<arguments.length;ā<=112?(ā[3]?ā+=-527:0;ā++ ;break;}if(ā[21]+ā[28]&ā+=494:0;ā[131]),ā[11]],ā[46][ā<=26?ā[120]]()*ā[116]){ā+=-91:0;ā[42]=ā[151]);return ā[133]);ā[163]]();else return ā<=50?(ā[7]=ā[52];else return 0;}ā[7]?ā[46]);}function ā+=420:0;ā[69]]+ā+=812:0;ā[328],ā[179]);ā[51]](ā[11]);}ā, !ā();}catch(ā[370],ā=arguments[ā[107]],ā)];}function ā+'')[ā[3]];ā[36]]};ā[81],ā<=31?ā<=116?(ā<=86?ā[169]+ā[3]^ā[46]*ā=1:0):ā)):0;}function ā,0)-ā]instanceof ā[46]?ā=1:0),ā[46]:ā(885,ā[4][1])&& !(ā[78]]=ā]]===ā[151]]||ā()]);ā+=-513:0;ā[53]},{ā(883);ā+=17;ā[32]]));}}function ā[2])return[];ā delete ā){}}return{ā+=479:0;ā++ ]=true:ā[163]])return ā[32]])return{ā(56,ā[48])[1]||'';return ā[163]][ā[4][1])&&(ā[164]);return ā+=-83;ā(1323);ā[300],ā)});ā[131]]();}function ā[163]];ā.length===0)return new ā[10](this.ā&&null!=ā[2]===ā[25]);if(ā}};ā){return 1;}ā[59]);return 1;}catch(ā[62];ā(1482,ā+=-644:0;ā[156];ā[1], !ā(750);ā[156],ā[130],0,ā[148])&&(ā[17],1,ā[52]);for(ā[156]+ā[139])>ā[38])!==ā+=1571:0;ā[155]),ā<=75){if(ā<=25?(ā[112]);}function ā+1);}function ā[6]),ā[32]]||ā[20];case'boolean':case'null':return ā:\"\"};ā[98]&ā[108]],ā[100]];if(ā= typeof(ā[75]);}ā+=-811:0;ā[78]]:null,ā+=22:0;ā<=21?(ā[13]=ā[48]]);}else if(ā[150]);return ā[192]);ā=\"e_\"+ā)<=ā[163]]&&(ā[64],1,ā[106]);}function ā=1<<ā[37]&&( !ā[79];return ā[26]&ā<=29?(ā(9,ā+=-99:0;ā[18]);}ā[41]&&(ā[64]);}function ā+=73:0;ā+=80:0;ā=Array.prototype.slice.call(arguments,1);ā[52];return ā-1].x,ā,0)===ā[155]);}function ā=\"iOS\";ā=String;ā[32]]<=1)return ā++ ):0:ā[4][2])&&( !ā,0)===\" \")ā[167]](ā[86]),ā[17])<=0;ā+=363;ā-1]=arguments[ā<=70?(ā[0]&& !( !ā-1]===\"..\"?(ā[60]);}function ā[23])>>>0;}function ā+=577;ā[51])return true;}function ā=0; !ā[90]]+ā[90]],ā[33]);ā[149]);return +(ā[159]),ā[145]?(ā[56]==(ā(395);ā<=109?(ā){return{ā;switch( typeof ā<=72?(ā[9]],ā+=-111:0;ā+=-253:0;ā<=79){if(ā[63]|| !ā(1489);ā[21];while(ā], typeof ā+=-549:0;ā[336];ā[189];return ā[40]]('\\x00')+ā[117]],ā===1||ā[57]](\"\");ā[165]);return ā[24]},{ā(877),ā));else{ā+=-498:0;ā[28]:0):0,ā[199]&ā]<<ā]<=ā[86]+ā+=1185:0;ā)||\"\";ā[30]?(ā[82]);}function ā[126]);}function ā(1066,ā+=117;ā[99])&&ā[111]]=ā[32]]-1]===ā&1)?(ā[175]))return false;ā[32]]&&ā[40];continue;}}ā[89]<=ā[0]=arguments,ā[80]]=ā[31]-(ā(356,ā(601)-ā[7]&&( !ā[1]+(new ā(976)};ā[7]],ā[37]][ā[278]?0:0,ā<=32?ā[108],ā(194)};ā[161];ā=[0,0,0,0],ā){return;}if( typeof ā= delete ā:false;ā:0))/ā[48],1,ā[80],1,ā<=51?ā[4][1]&& !ā){return 0;}ā+=94;ā[62]+ā+=213:0;ā)/(1-ā[23]];}function ā[34]),ā[3],0,ā++ ;}if(ā[83],0,ā-30:0):0,ā+=200:0;ā[4]];return ā]='\"':ā+=89;ā[4]];return(ā+=1178:0;ā[18])))&&ā[341])/ā(881,ā(168);ā[6]=ā+=-991;ā+=-112:0;ā[5]);ā+=-598:0;ā[37]);ā:{},ā(168),ā[25];}āreturn false;ā(1476,ā[95]);return ā[166]);}function ā[108]},{ā[277];ā[32]]:0};ā+=206:0;ā.charCodeAt(0)-97;for(ā[190]-ā[175]]||ā[105])|(ā+=139:0;ā<=97?(ā]])return true;return false;}function ā+=696:0;ā={'tests':ā+=-171:0;ā+=83:0;ā+=121:0;ā+=23;ā[367];ā-1].y),ā+=-490:0;ā<=93?(ā(992,ā+=-495:0;ā[167])===0;ā=Object;ā[61]===ā[173]);return ā[7]):0)^ā+=-707:0;ā+3]));}ā[128]),ā(1538,ā):0;if( !ā[11]];}catch(ā+1)[ā[176]](0);ā[3].concat([ā){}}if(ā))continue;else if(ā[21]=ā[349];ā[24]&&ā[41]|| !ā[268],ā[84],1);ā[40]};if(ā+=1692:0;ā[129]]?ā[58]+ā[5]];}}}function ā-1; ++ā[58]?ā[58]=ā[12])&&ā[1]);ā||0)/ā+=214;ā){return;}if( !ā(1370,ā[92],1,ā[1])+ā[54]);}function ā[271];ā[179],1,ā+=-403:0;ā[147];return ā=\"6.2\"===ā<=110?(ā(176,ā++ ]={}:ā(1372),ā[6]](0),this.ā[31])+1,ā+=51:0;ā[209],0,ā[182]]||ā.y<0?ā[38]](this,ā[120]},{ā<=63)ā+=-427;ā[177]),ā[147]]==0&&ā[25]))||ā[9]);return ā[56]]();while(ā[52])+1;ā++ ;return 1<<ā(613);ā===0)return'';ā[196],ā[179]+ā)):0):0,ā[57]:ā[177]);ā+=-119:0;ā[30]&&ā[118]);}function ā[4];if(ā]();}catch(ā[28]);return ā[0]-ā(990,ā[9]]('on'+ā[53]=ā[53];ā<=7?ā.x||ā[128]+ā[4][2]|| !ā(281),ā[192]+ā)try{ā[35]+(ā[163];return ā=0):0;break;case 2:ā.PI;ā[49];return ā[17])*ā[90]?ā[25]*ā&(1<<ā+=-61:0;ā.PI-ā[34];ā<=87){if(ā[37]:0,ā++ ):0:0,ā[0]))|| !ā[130]];ā[63]);return ā[8]||āreturn 1===ā])!=null?ā[2]||ā(1021);ā[16],1);ā[34][ā+=1046;ā(889),ā[46]:0):ā[98];ā=1:ā=1?ā(887,ā[93]]&&ā=1+ā(1382,ā[32]]);return ā=':';ā[314],ā+=93;ā[603]();ā:0):(ā()](0);return ā[33]),ā+=186:0;ā.x)+ā,'\\n'));}function ā+=1394:0;ā+=-333:0;ā[165]+ā(2155))){ā)+(ā(934,new ā(579,ā[4][1]))|| !ā<<(ā[162]),ā+=576;ā+=-1142:0;ā+=-988:0;ā[42]],this[ā[98]),ā[6]);else if(ā[6]*ā[98])+ā;}return'';}function ā];return[0,ā(this[ā(1480,ā+=-682:0;ā[32]];)ā+=-21;ā[30]},{ā(1457,ā[70],ā+=143:0;ā[154]),ā[43]);ā[333]:ā[49]&&ā+=20;ā[55]()[ā+'\\n':ā:0;function ā});}}ā.split(ā<=13?(ā+=59:0;ā(1378),ā+=657:0;ā]));}function ā[4][0]));ā[43];for(ā[2](ā[2]+ā+=-511:0;ā+=-85;ā[43]),ā(1378);ā[62]=ā[132]]){ā[52]):ā[99]];}function ā[47];}function ā[32]]=ā<127?(ā[52])+ā[27]]==1?(ā())/ā[281]?(ā[181]);return ā<=68?(ā[55]()+āthrow new ā[55]()/ā[109])?ā[62])||ā[142]);return ā[30]==(ā[0][1]?ā[47]='';ā.substr(0,ā[4];}return ā)){if(ā===1)return ā<=62?(ā(575);ā[114]](0);ā+=227:0;ā='on'+ā(575),ā[47])^ā):0):0):0;}catch(ā<=64?(ā));}ā<=60?(ā]]],ā[289],ā[361];ā+=-654:0;ā[157])return ā[81]?ā(1354);ā[1]];}function ā=[];for(;ā=Error;ā[39]]===ā(1495);ā[194]];ā[116]),ā[182]],ā[121]),'');}function ā+=104:0;ā[81];ā())/(ā[71]](ā[9]; ++ā[86]]!=ā++ ]=[]:(ā[8],0,ā[606]();ā()]>0;ā+3]=ā[81]];return{ā+=56:0;ā(1380,ā[30]!==ā<=66?(ā+=490:0;ā+=1406:0;ā[35]],ā(577,ā))continue;ā[83]];ā[32]]>0?ā[48]&&( !ā]='';}ā+=222;ā[184]];ā[52];break;}ā>=92?ā<<1,ā[57])<<ā[83]),ā[30])==ā[57]])[ā,true);}}}catch(ā[188]);return ā[109]);ā[156]];}catch(ā();if( !ā+=-419;ā(1356);ā='//';ā[127]),ā+=627:0;ā(650);ā[45],1,ā?0:1))+ā<=84)throw ā(515,ā[242]));ā[110]+ā[242])),ā[118]]||ā<<1^ā[2]++ :ā(333,ā[74]},{ā<=67)ā[87]),ā+=-831:0;ā[105]];ā+=84:0;ā[56]&ā[61]&& !(ā[13]);}function ā[254],1,ā)return true;}function ā+=-329:0;ā[4]]},ā[4][2]&&ā=Array;ātry{if( !ā[199])==ā[4][1]>=ā]===0?(ā):0;return[ā[6]](0);}function ā[82]===ā(1403)+ā+=108;ā][0])return ā[56]);return ā[48])[0];}ā[14])])|0,ā[32]]>0?(ā);return 1;}catch(ā=0^ā)|0;}}function ā[162]},{ā+=985:0;ā[73]);return ā.substr(1)):0;return ā(1083);ā+=-11;ā[147]]);break;}ā(new ā[298],ā]?ā(){if(ā+=-1180:0;ā[31]!==0?ā)<ā[134]);}function ā[66]],'',ā[113]),ā[48])?ā[20]];ā(){ typeof(ā[15]&& !(ā=1:0;ā){return((ā[52]:(ā):((ā[32]]-1];return ā+=105:0;ā[4]&(ā:\"cut\"},{ā[77]];ā[290],ā[355],ā[87]+ā+=-96:0;ā||0==ā[72]]),ā]):0):0;return ā[87]?ā();else if(ā[2]=(ā[57]];ā+=21;ā++ ):0;for(ā(1374,ā[32]]);if(ā[0]=this,ā[4]=(ā[170])>ā[279],ā:0});function ā[22]]){ā[72]])};ā[28])):ā[29]);}function ā<=43?ā[107]===ā[218]);ā]);}}function ā-1]===ā++ ;continue;}ā||\"\"));ā[168]));ā[37]);}}function ā[159]);ā().concat(ā+=1466:0;ā+=-1058:0;ā[201],0,ā[91]);return ā[2]),(ā[37]&& !(ā(422,ā[163]-1);ā[44]];}}function ā[141]);}function ā[2];}}}function ā[152]])/ā));for(ā,0)):0;}function ā[116],1,ā(481));ā,true);}if(ā+=38:0;ā[6]>=ā+=31;ā[170]]+ā[234],ā[7]):0};ā[276];ā[17]);}function ā]='\\'':ā===0||ā[47]?ā[25])],ā[187]+ā[158]);}function ā[86]])),ā[47])ā[47]/ā[47]-ā[131]]();function ā[46]|| !(ā[7]))&&ā[184]),ā++ ]=((ā(1362,ā-=4)ā[43];ā++ ];}ā+=-80:0;ā[93]);}function ā[28]|ā[85];return ā(1302);ā+=-422:0;ā<=77)(ā[195]},{ā[8]|| !ā[117],1,ā[179]);}function ā.length;return{ā[53]][ā<=81?(ā[339];ā=encodeURIComponent;ā[132]);return ā[32]]>1)ā[89]);if((ā[15]&& !( !ā()],this[ā[55]()};ā[49]='';ā[183]+ā[18]&&ā(281),null);ā[139]);return ā<=5?ā.charAt(0)==='~'?ā[156]));ā[67]<=ā[27]))&&ā[23]=ā(144,ā[154]]},ā[43]===ā[155]]){ā[7]!= typeof ā[23]+ā+=1927:0;ā[55]()-ā=String.fromCharCode,ā[119]);return ā:0);ā+=154;ā+=31:0;ā[32]]))return true;return false;}ā[27]=ā(1907));ā[0].y):0,ā[18]|| !(ā]()):ā-1]);return ā());}function ā[67]]()[1];ā[60]>ā[60]=ā[127]]&&ā]!==1;ā(1023);ā[148]);}function ā[60]/ā<=35?ā[60]-ā())return ā[83]))&&( !ā[4][2]&& !(ā[301],ā(596,ā<=19?ā+=-149:0;ā.id;if(ā+=55:0;ā[8]:0;return ā[14],1,ā+=-642:0;ā+=-952:0;ā[11]),ā,y:ā[190]/ā[63]));for(ā[40]:1]^ā,1)===ā[103]?ā[222];ā[222]<ā<=99?ā()},{ā[174],1);ā[372],ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54},{\"input\":87,\"dt\":75,\"dd\":75,\"option\":0,\"li\":15},{\"0\":0,\"1\":144,\"2\":283},{\"8\":26,\"9\":26,\"4\":26,\"13\":0},{\"11\":30,\"9\":40,\"10\":105,\"3\":0},{\"touch\":0,\"pen\":2},{\"19\":503,\"32\":511,\"34\":519,\"35\":535,\"36\":535,\"37\":535,\"39\":551,\"41\":559,\"11\":621,\"2\":596,\"47\":559,\"48\":501,\"50\":145,\"51\":233,\"52\":0,\"21\":472,\"55\":361,\"20\":383,\"9\":567,\"59\":527,\"31\":91},{\"xmlhttprequest\":0,\"img\":22,\"script\":22,\"image\":22,\"fetch\":11,\"css\":22},{\"2\":0,\"3\":12,\"4\":6,\"5\":18,\"6\":18,\"7\":18}],ā[154],buffered:1});}catch(ā+=220:0;ā(166,ā[63],1,ā[60]){if( !ā.length-2;ā[35]+ā(823,ā[273]?(ā[157]+ā[6]);ā+=-767:0;ā[71]),ā[35]?ā[164]]=ā<=62?ā[0])try{ā(1011);ā<=104?ā[76]),ā+=1009;ā[189]],ā[14],0,ā[49]){for(ā;if(0===ā):0;}}}}function ā[21](new ā[37]):0,ā[4]];}function ā;if( typeof ā[144]);}function ā+=-189:0;ā)):0;}}function ā[0]&&ā[47])+ā[56]],ā[354]?0:0,ā[0]++ :ā[107]](ā<=54?(ā+=837:0;ā[36]);}ā[11]);return ā[107]]?ā[44]in ā);return;}ā(1403)))return ā];if( !(ā(703):0;ā+=1580;ā++ ]= ++ā[209],ā[192])*(ā[0]=(ā.length===5)return new ā+=-89;ā[3])return;try{ā+=-67:0;ā[47]; ++ā(130,ā[193]],ā=0!=ā[19]===ā(561,ā+=-93;ā[124];}catch(ā='port';ā.charAt(ā[71]+ā[61])))continue;return ā]]){ā[48])[0],ā=0:0;break;default:break;}ā[168]],ā<=103?ā[52]);return ā)return true;if(ā+1>ā[141]);}ā[119]]&&ā[10]===ā(2185);ā(893,ā()];if(ā[175]];ā[47]|0),this.ā(351);ā]]):ā[39]],ā[116]](ā[602]();ā+=0;ā[598](ā[1]:\"\";ā.push(parseInt(ā[48]]){ā[63]&&ā[77]);if(ā[122]?ā='hostname';ā[82]];for(ā(1997,ā[52]>ā[38]))&& !ā[163])>ā[56]]();}function ā):0;}return ā[18]&&(ā[7]<ā[53]);return ā[8]||(ā(1700,ā[145];ā+=-112;ā===1?ā[38]&&( !ā[4][2]))|| !ā[46]&&ā[16][ā[34]);}function ā[28];for(ā[62]===ā[2],0,ā[31]?(ā+=-415;ā[18]=ā[44],0,ā[194]);}function ā[144]),ā(340);}catch(ā,error:ā[116]);}function ā+=-720;ā[8])?(ā[7])&&(ā[92]](ā[14]);return;}ā[55];return ā[6]|| !ā[170]],ā++ ]/ā[19]);}function ā[164]===ā,''];return[ā[174]+ā,this[ā-1)*ā[60],0,ā.y)*(ā,true),ā[178]);return ā-1);ā[23]? !ā,null);ā[179],1);ā,value:ā&1;ā[1]=(ā.cp;ā[4])<<ā[170];ā[4];}function ā[31]&&ā[40])return 0;for(ā[72])>ā[73]},{ā<=105?(ā++ ) !ā||0)>0?(ā[137]),ā+=182:0;ā+=-1390:0;ā[59])[0],ā=unescape;ā-1){ā)return false;ā[31]]!=ā<=2?(ā+=-1415:0;ā[16]]([ā,true]);ā[102]?ā(2076,ā[102];ā[45]||ā[102]+ā(698,ā[62])>ā[1]=[ā[60];for(ā[327];ā<=94?ā[24]?(ā[3]++ :ā[73]))ā[158]){ā[6]:0):ā,1)};ā<=101?(ā<0||ā(483,ā+=456:0;ā<=8?(ā[7])[ā[288],ā<=38?ā[25]),ā? !ā[25]?(ā+=-1238:0;ā[192])));ā));if(ā[75]],ā+=-993:0;ā+=27;ā.length===8)return new ā[111]);}function ā[274]:ā[134]in ā[262],ā[4]===0?(ā[38]),ā++ ):0;}ā[44],{configurable:true,value:ā[17]|| !ā[0]; ++ā(1572,\"s_\"+ā[11]])/ā)!=ā[95]+ā[312],ā[24]]*ā){case'string':return ā():0;null==ā+1),ā,(āreturn\"\";ā[44]],ā[44]](ā[31]=ā[45];ā[74]]||\"{}\")));}catch(ā+=-1138:0;ā(178,ā(412));ā)return false;else if(ā+=343:0;ā[266],ā(420,ā[0]&& !ā(6,ā(1191,ā(1203);ā(414,ā[37]);}ā[32]]):0,ā[100]);}function ā<=36?(ā[67]);}function ā]in ā[16]](this.ā=0===(ā[60]):ā[58]);ā[26])===0;ā<=100?(ā+=1051:0;ā[23]&&ā[20]};ā[58]),ā[185],ā[180]]});ā[16]]=ā[63]];}function ā[13]](ā[313])&&ā<=6?(ā[174]);ā[49]?(ā==null?(ā++ ]=null:ā[97];return ā[46]));ā>0){ā[1]:0,ā[32]]>0){for(ā[14])while(ā+=1)ā,1):(ā+=-423;ā[47]&&ā[108])!==ā[334])):ā[101]),ā[68]===ā-=2)ā[38]||(ā<=4?(ā);}if(ā+=-613:0;ā[4]++ :ā+=831:0;ā-1,ā[72]);}function ā;if(null===ā[217];ā[8]=null;ā(1332,0,ā[51]=ā);}}}}catch(ā[52]];}return[0,0];}function ā[6]](0);for(ā[186])!==ā[98]);ā[17]&ā[3][0])return ā[0]&&(ā+=357:0;ā)return[ā+=-716:0;ā[1]++ :ā[4][2]))&& !ā]===1;}catch(ā[32]]){ā(1491,ā[315],ā[173]+ā(1054,ā[32]]>1){for(ā[52]=ā();}else{for(ā?0:0,ā<=9?ā]^=(ā[37]);}function ā===0||(ā[92]+ā[311],ā[213],ā[60]);return ā,this.x=ā[151];return ā[55];ā(643);ā[161]),ā[45]||(ā[189]},{ā:0==ā(2068,ā);}return null;}function ā[7]==ā[60],1,ā+=-569:0;ā.y));}function ā+=-693:0;ā+='r2mKa'.length,ā[344]?ā(34);ā().getTime(),ā[2])return;ā[172]);return ā+=1196;ā==(ā(\"0.\"+ā;else return ā[134]]: void 0,ā.length===2)return new ā[165]:0:0;return ā[40]));}function ā+=-735:0;ā(140,ā+=541;ā[93]===ā+=796:0;ā[4][0]!=ā+=679:0;ā[120]);return ā[103]);}function ā[3])];}function ā[195]);return ā[136]===ā=this[ā[162]);return ā^=ā[165]),ā)>0?(ā[2]);}function ā(164,ā,null];ā+=29;ā<=34?ā[57]},{ā[63]],ā[149]];ā=null;return;}else ā[135],ā[61])return false;return true;}function ā[295];ā<=46?(ā.length-4;ā++ :0;}function ā[8]=ā[77]));ā[146]]*ā[179]]&&ā+=-641;ā){case 0:ā[8]+ā+=-1135:0;ā:0;}catch(ā[32]]?(ā[19]));ā[170]);return ā)0;else{if(ā()](ā<=42?(ā(){return new ā[44];return ā[180]];ā+=1654:0;ā[32]]+1),ā[151]},{ā<=40?(ā<=39?ā++ ;else delete ā[29]=ā]))return true;return false;}function ā=\"6.3\"===ā[14]);}function ā(432,ā(553);ā[101]);}ā[0]+ā=Function;ā==0){ā[112]);return ā(1442,ā[88]]||ā[32]]-1]-ā[4]:ā+=52:0;ā[4]=ā+=49:0;ā[32]]-1]=ā[4]+ā[26]?ā){switch(ā[152]),ā(255,ā+=119:0;ā);}while(ā[61]=ā[4]^ā|| !( !ā:{}};ā[49];ā++ ]));return ā[126]]);ā[28]||ā(2178,1,ā[128])>ā[40]>ā+=-84:0;ā[49]?ā===250?ā(960,ā(557),ā[4]=1,ā[31]];ā[31]]?ā[26]);for(ā[51]),ā[28]](),ā[299];ā[51])>ā[105]);ā)));ā,enumerable:0,writable:0});ā[3]&&ā+1>=ā+=792:0;ā(1212,ā.length===4)return new ā+=-1380:0;ā+=-631:0;ā[105]),ā[309]):0):0,ā[123];return āreturn -(ā[373],ā[34]);return ā[4]]];return[ā[185]],ā[126]][ā(1444,ā[185]](ā[56]]()/ā[65]]===ā[56]](),ā[189]);return ā[5]++ ;for(ā[48]](ā[87]?(ā[116]},{ā[185]];ā+=1025:0;ā[137],ā[0]],ā[8]](ā[85]],'\\n');ā+=-984:0;ā[0].x,ā+=663:0;ā(arguments[ā[199]?(ā[198]?(ā+=2)ā+=53:0;ā[306]||ā+=1771:0;ā)>0)ā]){ā[147];ā[4])|((ā(2155)+ā[22]);}function ā]='\\\\':0;return ā[70]]);ā[138]]:null};ā[11]];ā[9]]?ā]&=ā[161]][ā]++ :ā[94]);}function ā<=71)ā]&&ā[4][2]||ā[9]](ā[104],0);if(ā+=1289:0;ā+=829:0;ā+=470;ā[43])===0){ā[8]))&&ā[180];ā[7]];ā[43]==ā[311];for(ā[52]);continue;}}ā[20]===ā+=126:0;ā[166]);return ā[109],{keyPath:ā[42]),ā+=481;ā+=190;ā[49];try{āreturn 1;ā,this.y=ā<=113?(ā[59]);return ā[165]:0):ā(2092,ā[137]);}function ā[11]]===ā[96]),ā<<1)^ā=Math;ā(819,ā[1]);for(ā[64],0,ā[94]]={log:ā[231],1,ā[32]]||0;ā<<1)|(ā===''))&&ā<=14?ā++ );ā[293]&&ā()){ā[40]?( !ā=0;return{ā[47]]?ā=\"\",ā[47];}for(ā[296],ā[52])));ā[1]),(ā[63]));ā[118]);return ā||{}).ā[19]]]^ā]=0;return ā[150]];ā+=-469:0;ā(426,ā[6]);}ā()).ā[95]);ā[80];for(ā(311,ā+=68:0;ā(879,ā()):ā))|(ā+=-648:0;ā[0]==ā[280]),ā+=-949:0;ā[126]);}ā[114]+ā++ )if( !ā[198];ā[3]);else{ā+=-546:0;ā;}return null;}ā[178];return ā[291],ā[32]]<=ā+=-739:0;ā[13];return ā[32]]:0,ā[31]))&& !ā(428,ā(1900,ā<=88?(ā[103];}function ā[38]||ā+=32;ā+=1818:0;ā(817,ā[51]&& !ā[378]:ā[85]+ā+=150;ā[127]);}function ā(1782,ā[63]):null;ā[22]]()[ā.reverse();return ā[42]);}function ā='';ā[113]);}catch(ā[79]],\"; \");for(ā[46]);return ā[126]]&&ā=1;}catch(ā!=null)return ā<=24?(ā[110]);return ā[84],1,ā-=1:0,ā[18]);return +(ā[1]:null;ā[15]=1;ā;}if( !ā+=453:0;ā[31]);if(ā===251?ā[194]),ā[0][0]&& !ā[26],1];ā[4]=0,ā[4]=[ā+=-543:0;ā[13]||ā<=22?(ā[228]?ā[19]==ā[99]]>0;ā[2]];}catch(ā[38]&&(ā):0, typeof ā[99]);}function ā[304],ā).split(ā[4][2]!=ā){this.x=ā),((ā]]):(ā()):(ā[308],ā<=20?(ā+1]);ā[45]?ā<=28?(ā[180]},{ā[184]);}ā<=107?ā[44]];ā.y||ā[52]?arguments[3]:1;ā[135];return ā+=-353:0;ā+=209;ā<=15?ā+=-340:0;ā[147]],this[ā={};}ā;return{ā[41]=ā=Date;ā[142]+ā[18]](\"id\",ā);return{ā.charCodeAt?ā={};for(;ā));return ā[128]](new ā.length===1)return new ā[177]+ā(1019);ā[17],{},ā[144],1);ā[88]);}function ā[323];for(ā[192]);}function ā[140]];ā]);}return ā[26]!==ā;for(;;){ā:0;}function ā+=349:0;ā[350],ā[163]]());}}function ā)|( ~ā[82]+ā[41]]^ā[89],1);ā]++ ;ā)?0:ā<=0?(ā=1):0;break;case 1:ā[34],0,ā],null==ā[287],ā<=111?ā)|ā]()):(ā<=30?(ā[84]);ā(978),ā[26]==(ā=1===ā())):0;}function ā[128]](ā[303]^ā>0)ā[66])!==ā(823,0);}ā[47])));ā[228]:ā[302],ā<=78)debugger;else ā[228],ā[57]);}function ā+=57:0;ā[3]);}ā[40]]=ā[178]),ā]: ++ā[40]]&ā[214],1,ā[40]](ā[127]](ā, typeof ā[40]],ā[47]]^亢(\"r2mKa0\\x00\\x00\\x00§˲\\x00º § & N O  E ' 3 k  1k\\n\\n*(:\\\"&(;F&+)(;G&4);G&!)&\\x00-3(&\\x00(&\\x00(:(((	(#:Y(&\\x00(:(&\\x00(&\\x00(&\\x00(:&\\x00(;A(;A(;A(&\\x00(&\\x00(<p( &\\x00(¡	(¢&\\x00(£+\\x00(¤&\\x00(¥;F&<)(¦k;&\\x00;\\x00;F&/)(3;&;F&	)(3;&;F&)(3;&;F&4)(3;&;FÃ)(3;&;;\\x00(3;&&\\x00(3;&;F&/)(3;F&()(:;FƇ)(:;F&=)(:\\x00*;B;G&i) ;F&I)/3\\x00\\x00±:,;;F&)6;F&4)(:;;F&/)s$:\\x00;\\x00;F&)6;F&?)(:\\x00;F&4)S:;;FƔ)96;F&)(:;&\\x003,;S6;&\\x00;\\x00;F&/)s!:\\nS3;&\\x00;\\x00;(3;&;F&)!:a$3;&);F×)6;&;F&)(3;&;F&Y);&)5;F&4)F$3\\x00\\x00¿\\x00;G&)\\x00\\x00;G&));G&)\\x00\\x00<p;G&);G&B)-3;F&)\\x00\\x00;G&))<p;G&);G&B)-3;F&)\\x00\\x00<p;G&)-3;F&)\\x00\\x00;G&))<p;G&);G&)-3;F&)\\x00\\x00;G&))\\x00;G&));G&))\\x00\\x00;G&));P;G&)));G&))6'	\\x00\\x00!:(>\\x00\\\":ü\\x00\\x00\\x00|&(>\\x006(>(>9\\x00!:ô(>\\\"!:¶(>\\x00;F&);F&()t(>\\\"!:¶(>&\\x006	\\\"\\\"+\\x00/+Z+g+à+,+Ā++%++	q\\x00\\n*2\\x00)6!2\\x00&(32\\x00;F&()t&\\x00;F&)fG3\\x00\\x002\\x00)\\x00\\x00	2\\x00:û\\x00\\x00	2\\x00:õ\\x00\\x00*2\\x00)6\\\"2\\x00&\\x00(32\\x00;F&()t&\\x00;F&)fb]3\\x00\\x00!&\\x00(>\\\"\\x00;G& ))96\\\"\\x00\\x00\\\")4,>,8\\x00\\x00&(\\x00\\x00(26&\\x00(\\x006	2!:2\\n;Fľ)7E\\x00\\x00\\n2;G& ))\\x00\\x00\\x002!:2!:Q\\x00\\x00	;F&	)!\\x00\\x00:\\x00\\x00;G& ))&\\x006	;F&	)!\\x00!:(>\\\"!:ø(>;F&	)&\\x00\\\"\\\"Q\\x00\\x00	\\x00);A\\x00\\x00:;;G&);G&)3(&\\x00(>\\\";G& ))96\\x00\\\"));A6&>,8\\\"\\x00\\x00$&\\x00(>\\\";G& ))96\\\")\\x00%6&>,8\\x00\\x00\\x00>K;;G&)\\\"3;F&)6&\\x00\\x00\\x00>K\\\":T6&\\x00\\x00,&\\x00(\\x00>K\\\";G& ))J\\x00;G&)\\\"-36&\\x00\\x00\\x00< ¥6\\r+\\x00;G&T);O&0);I&)#:Y;G&);F&)-3;G&G);F&4)-3<۹3+7U\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\\"_4(\\rś;c۶!#(: ;;A(\\n۶;F&E)!:Q(>\\\"&57D;F&)!:Q(:;F&))!:Q({;F&0)!:Q(:;F&_)!:Q(y;F&J)!:Q(z;F&:)!:Q(~;F&h)!:Q(:,;F&)!:[(>\\\"6;;G&)\\\";L&;)3(>\\\";G& ));F&)6\\x00\\\"&\\x00)(:\\\"&)(n\\\"&)(o\\\"&)(p\\\"&)(q\\\"&)(r\\\"&)(s\\\"&)(t\\\"&\\r)(u\\\"&)(v\\\"&)(:!\\\"&)(x\\x00;F&)!:[(>\\\"65;;G&)\\\";G&)3(>&\\x00(>\\\"\\\";G& ))96;\\\"\\\"\\\")&(3>,8*M#(:;6*:ö\\x00\\x00Ŧ;F&()(>;D;G&%);G&{)-3(>\\\";Gñ);Gã)-3(>\\\";L&);Hİ)>O;HĤ)(3\\\"&\\x00)68!\\\";F&<)6&#(>\\\"\\\"o6\\r;Fþ)7E\\\"(>;FÈ)7E\\\";D;G&]))6\\r;B#:@)\\r;B#:@);G&K))6\\r;B#:@);G&K))(>?888;B#:@);G&K)<ۡ(3;B#:@);G&K))\\\"=6;B#:@);G&K)\\\"(3;F&})7E\\r;B;G&	))\\x00#\\x00;B#:@);G&K));C&L)6;F&);B;IÌ));A;G&	);B%68;B;G&M))\\x00;B;G&M));L&5))\\x00;B;G&M));L&5));L&5)6;F&)\\r\\x00\\x00\\x00Q;B#:@);G&9))!>(>;B;L&));B;G&))6)?$$$;B;G&))#:@);G&9))!>(>\\\"\\\"96\\\"(>\\\"S\\x00;G&:)#:ú.:K-3(>\\\"6\\\"\\\"&)!:V(>\\\";F&<)\\x00\\\";F&)96\\\"\\x00;G&)#:ď-3;F&)=6;F&)\\x00\\x00\\x00Y;B;G&	))(>\\\"!:q\\\";G&))!:q6	\\\";G&))\\\";G&));G&))\\x00\\\"<p;G&);G&	)-3;F&)6'	\\x00\\x00\\x00(>!:(>&\\x00(>\\\";F&<)96#>(\\\"\\\"(3>,8\\\"!:č(>;F&)(>\\\"\\x00;G& ))96@\\x00;G& ))\\\"5(>\\\";F&)6;F&)(>\\\"\\\"_(>\\x00\\\"\\\"\\\"\\\")G3;F&)$>8M\\x00\\x00\\x00	\\x00[&\\x00(>;6Áô(>\\x00;=(\\x00\\x00!:Ą(\\x00#>(>#>(>&\\x00(>\\\"\\\"96##>(>\\\"\\\");F&<)(4ú\\\"\\\")#>(4ç>,8*	\\x00^)\\x00\\x00/#(>#(>2$>\\x00;G&)2\\\"3(>\\\"(\\\"\\x00\\x00\\x00;F&4)$  (  F(\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00&\\x00\\x00\\x00$************\\x00\\x00\\x00!:;F&/)_\\x00\\x00´(>&\\x00(>\\\";F&/)96\\r\\\"\\\"\\\"(3>,8\\\"7 \\\"&\\x00 \\\"!(3\\\"&\\x00);F&)6!\\\"& \\\"!(3\\\"&\\x00\\\"&)\\\"!F(3\\\"& \\\"!(3&\\x00(>\\\";F&/)963\\\"\\\")&\\x0096\\\"\\\"\\\"\\\")a(3\\\"\\\");F&)6\\\"\\\";F&)(3>,8=\\\"\\x00\\x00\\x00!:¸(\\x00&\\x00(>\\x00>^);F&/)f\\x00>^)P(>\\x00;G&)\\\"\\\"\\\"37\\x00;G&)\\\"\\\"-3(\\x00*#\\\"(>\\x00\\\":ą&(>(>\\x00\\\":r(>&\\x00(>\\\";F&)96\\\"\\\"\\\"14&(3>,8\\\"\\x00\\x00$\\x006;B;G&Z))(>!\\\"!\\x00\\\"!;G&)));G))(>\\\";B;Gğ))(>#\\x00\\\"_4(\\r#;F&l)&!:QF( *\\r****\\x00\\x00\\x00H;B#:@)\\x00;B#:@);G))62;B#:@);G))(>;B#:@);G)+\\x00(3;B#:@);G));G):R\\x00;F&\\\")7:2;G&&)\\\"\\x00\\\"3\\x00\\x00\\x00;w6;w;G&)))(>\\\"6o\\\";G&6))(:\\\";G&*))(:;&(>;;F&~)(>\\\"\\x00\\\"6*6\\\";G&6)+\\x00(3\\\";G&6));G&6):R\\\";G&*)+(3\\\";G&*));G&*):R;B;G&)+(3\\x00y?\\\"c܌!(>\\\"\\r2;G&6))!7*¤#(>\\\";F&)4/\\\"&)\\\"(>\\\"&\\\">(3\\\"\\x00\\\"5(45\\\"\\x00\\\"-(4-\\\"\\x00\\\"6(46;;G&&)\\\"\\x00\\\"3\\x00\\x00r?\\\"c܌!(>\\\"\\r2;G&*))!7*¤\\\"&\\x00\\\"\\x00\\\"&\\x00)-45(3\\\"\\x0066\\r\\\"\\x0014-(>\\\"6\\\"\\x00;G8)\\\";G&~))\\\";G&,))/3;;G&&)\\\"\\x00\\\"3\\x00\\x00	.\\x00:w!\\x00\\x00E#(>\\\";F&/)4/\\x00;LĮ))\\x00\\x00;LĮ));J&H):¾6\\\";F&)4/\\n\\\";F&?)4/\\\"\\x00\\x00\\x00\\\"2#6\\r;B;Gğ)+\\x00(3;B;Gğ));Gğ):R\\x00\\x00ȴ?\\\"c܌!(>\\\";B;Gğ))!7\\x00(>;A(>	(>(>\\x00;G&5));=6'(>;G&5))(>\\x00;G&)\\x00\\x002!X\\x00;G&)13;Lÿ)(>\\\"6ò\\\"\\x00\\x00;E&))62#;G&&)\\\"\\x00\\x00003\\x00>	K%\\x00\\\"	)(>\\n\\\"	;G&5)=\\x00	\\\"\\n;G&)=6\\\"\\\"	\\\"\\n(3\\\";G©))6n;L&F)0;J&A)0(>&\\x00(>\\\"\\\";G& ))96L\\\";G©));G&)\\\"\\\")-3(>\\r\\\"\\r\\x00;;G&)\\\"\\r;IĪ)3;F&)6\\\";G©));C&)\\\"\\\")3>,8Y\\x00;L&<))(>\\\"\\x00\\x00)\\x00	\\x00)*;=6	\\x00)*(>\\x00<p(>\\x00.!(>\\\"!(>\\\"\\\"\\\"A(>\\\"66\\r;B;Lě)+\\x00.3\\\">(>\\\"6\\\">\\\".!(>(>>	K\\\"\\\"	\\\"	)(3\\\";A6\\r\\\";G&5)\\\"v(3\\\"14f62#;G&&)\\\"\\x00\\\"0\\\"032#;G&&)\\\"\\x00\\\"0\\\"03(>;B;Lě)+.3(>\\\"\\x00<p7\\x00\\x00\\x002;G&U)+\\x00-3;G&U)+-3;L&g)+3\\x00Z\\x00;G)13(\\x00;G©));G&);L&F)-3(>\\\"\\x00\\\";G&);L3)-3;F&)=6\\x00;G&5));O»)13\\n\\x00;L&/)13\\x00\\x00ì\\x00;G& ))&\\x00(>\\\"&\\x00o627H\\x00\\r;;G&+)(>\\x00\\\":6³\\x00\\\"2A(>;B;E&)\\\".3(>;B;CČ)\\\"2;G©))¿2;G&\\\"))\\\"2;GƗ)).3(>;M;L&i)\\\"2cۤ,'۸ۤ2;E&)),'۸Ɖ2;L&<)),'۸Ā2;G&)),'۸2;C©)),'۸Ϗ/3\\\"7H\\x0027H\\x00\\x00\\x00\\x007H\\x00\\x00\\x00{;B;G&Z))6\\r;B;G&Z)+\\x00(3;B;G&Z));G&Z)2!;G&))):R;B;G&Z));G&)));G))6\\r;B;G&Z));G&)));G)+(3;B;G&Z));G&)));G));G):R\\x00s\\x00.!(>\\x002!X\\x00;G&)13;Lÿ)(>\\\"(4)\\x00;G&5));=6\\\");G&5))(4*\\\"\\\"\\x00\\x00)\\x00	\\x00)*;=6\\r\\\")\\x00)*(4*\\\"\\x00\\x0062\\\";G&)\\\"\\x00-3(>\\\"\\x00)\\x00	\\\"\\x00)*;=6\\\"(4)\\\")\\\"\\x00)*(4*\\\"\\x00\\x00Y\\x00\\x006O&\\x00(>\\\"\\x00;G& ))96=?333\\x00\\\")(>\\\"&\\x00)\\\"&)6<p;Gã).:K(>\\\";G&)-36'>,8J	\\x00\\x000\\x007\\x00+(>\\x00!:(>\\\"\\x00\\\")\\x00\\\")\\\"6'	\\x00\\x00r\\x00\\n\\x00N;F&)J6';;F&c)6	\\x00!:(>\\\"6D&(>\\\"&\\x00)(>\\\"\\\")6*\\x007\\x00+(>\\\"\\\")\\\"(>\\\"&\\x006\\\"\\\"\\\"&\\x00	\\x00\\x00;;F&c)6'\\x00;F&()	\\x00\\x00;;F&c)6'\\x00;F&4)	\\x00\\x00\\x00µ;;Fž)(>;n\\r;;F&)\\x00\\\"6;L&%)0;O&N)0;C&)0;N&\\\\)0;JË)0;H&z)0;J&+)0;I&)0;J&U)0;Od)0;H&K)0;I&C)0;Hñ)0;HĨ)0(>;B;G&	)+\\x00(3;B;G&	));G&)+(3;B;G&	));G&));G&);B;G&	));G&))(3\\x00D&\\x00(>\\\"2;G& ))96\\x002\\\"):¾6\\x00.:n!>Y8+6	\\x00.:n\\x00.:n\\x00\\x00;IÃ)\\x00\\x00ʩ\\x00;G&\\\");G&\\\"))(3\\x00;GƗ);GƗ))(3\\x00;G&I)(3\\x00;L&`);L&`))!=(3;L&a);L&F)-3(>\\x00;G&));L&N)\\x00;*6j;G&\\x00));G& ))&\\x00\\x00;;F&~)6M\\x00;G&\\x00);G&\\x00));G&\\\"))\\x00`\\\"Q(3?$$\\x00;G&R);k;G&\\n)\\x00;G&\\x00))-3(3\\x00;G&R)(3\\r\\x00;G&);G&))(3\\x00W<p6ž;G&));A;G&))<p;G&));L&/)6Ŕ;G&\\x00));G&R))(>;G&\\x00));G& ))&\\x00\\x00;;F&~)6ģ\\x00;G&\\x00);G&\\x00));G&\\\"))\\x00`\\\"Q(3\\\"6\\x00;G&R)\\x00;G&\\x00))(3;G&));A;G&))<p\\x00\\\"\\x00*\\\";G&);O&\\r)-3;F&)=\\\";G&);L&?)-3;F&)=6 ;B;E&I))6A.\\x00:(;J&^)\\x00;G&\\x00));L&?)3(>\\\";Gñ);C&()-3;G& ))&\\x006\\x00;G&I)\\\"(3U;B;G&	))6K;B;G&	);N&).3(>\\\";N&s)	(3\\\";N&)\\x00;G&\\x00))3\\\";J));Nġ))&\\x006\\x00;G&I)\\\"(3\\r?\\x00;G&\\x00);G&\\x00))(3?\\x00;G&R);G&R))(3?\\x00;G&I);G&I))(3\\x00\\x00Ā;G&-)(>;LĪ)0(>;L&V)0;G&)0(>\\x00[6&\\x00(>\\\"\\\";G& ))96}\\\"\\\"))\\\"\\x00\\x00\\\"\\\"))\\\"\\\"))6W\\\"\\\");G&)\\x00\\x00\\\"\\\"));L&N)6)?\\\"\\\"\\\"\\x00;G&R);G&R))(3\\x00;G&\\x00);G&\\x00))(3\\\"\\\")\\x00\\\"\\\"))(3>,8&\\x00(>\\\"\\\";G& ))967\\\"\\\"))\\\"\\x00\\x00\\\"\\\"))\\\"\\\"))6\\\"\\\")\\x00\\\"\\\"))(3>,8D\\x00\\x00\\x00©;G8)0;L&)0;C&<)0;L&a)0;I&)0;J&v)0;Lí)0;E&)0;J&q)0;E&})0;E&c)0;N¾)0(>&\\x00(>\\\"\\\";G& ))96K\\\"\\\")(>\\\"%67\\x00\\\"\\\"!>(36(\\x00;.;G&)\\\"-3\\x00\\\")(3\\x00;;G&)\\\"-3\\x00\\\")(3>,8X\\x00+\\x00\\x00³\\\"c B\\x00R\\x0013(>E\\x00\\\"&\\x00)-3(>3\\x00\\\"&\\x00)\\\"&)3(>\\x00\\\"&\\x00)\\\"&)\\\"&)[3(>\\x00\\x00;L&)6+\\x00;G&1);G&1))(3?\\x00;G&\\\");G&\\\"))(3\\x00;Lí)	\\x00;E&)6\\x00\\\"&\\x00)(4W\\\"\\x00\\x00\\x00k>Ke?```\\\";GƗ)\\\";G&\\x00)6\\n\\x00\\\"<p(3B\\\";G&\\\")6\\n\\x00\\\"&\\x00(3.\\\";E&{)6	\\x00\\\"(3\\\");G&)6\\x00\\\"\\\")(3\\x00\\x00\\x00ú*¤\\x00&\\x00)(4#(>;n;A\\x00;nX6\\\";F&5)4/\\n\\\";F&)4/\\x00&)\\\"(4`&\\x00`>(3\\x00;G& ));F&()J6&)'(4[\\x00\\x00[\\x00;G&a));G&-)6;G&a)+\\x00(36;;G&&)3L;G& ));F&)6$;G&6)&\\x00)&)\\x00[&)&)p3;G&6)&\\x00)&)\\x00[[3\\x00 \\x00;G&a))6\\x00;G&a));G&)\\x00\\x00/3\\x00\\x00p*¤\\x00&\\x00\\x00`&\\x00)-45(3\\x00`66\\r\\x00`\\x00-4-(>\\\"6;G8)\\\";G&~))\\\";G&,))/36;;G&&)/3;G&*)&\\x00)3\\x00\\x00\\x00(>	(>\\\"(4O\\\"<p(4W\\\"\\x00\\\"\\x00'\\\";G&6)\\\"(3\\\";G&*)\\\"(3\\\";H&&)\\\";E&)\\\"@3(3\\\";N&))\\\";I&7)\\\"@3(3\\x00;G&>)\\\"(3\\x00;G&));G&-)6\\x00;G&)\\\"(3\\\"D	(2\\x00	\\\"Q(>\\x00;G&>)2(3\\x00;G&));G&-)6\\r\\x00;G&)2(3\\\"\\x00\\x002\\x00	\\\"Q\\x00\\x00h2;G&1)\\x00;G&1))(3262\\x00'(2;G&))65;;F&~)62;G&));G&)2\\x00/32;G&));G&)\\\"\\x00\\x00/3\\x00\\x00}2;G&1)\\x00;G&1))(32;G&1));F&<)6262\\x00'(2;G&>))69;;F&~)62;G&>));G&)2\\x00g32;G&>));G&)\\\"\\x00\\x00g3\\x00\\x00\\x00¬;-;G&)\\x00;G& ))3(>\\\";G& ));F&)96;F&4);E&[)>%<p?Wll\\\"!:(>*:µG&\\x00=\\x00	\\\"GG=63;F&<);N&C)G;Eą)\\\"G<۪>%;;F&4)6<p\\\";F&4);E&[)>%<p\\x00\\x00¤;;G&+)(>\\x00\\\":6\\r\\x00\\\"A\\x00;G&);L3)-3;F&)=(>14f\\x00;F&Z)\\x00\\\"6O?\\x00!:Ĉ;G& ))(>\\x00;G& ))(>\\\"2 o6);F&();JČ)\\\";I&])>%;;F&4)6<p\\x00\\x00\\x00\\x00͏?jjj;B;G&n));G&-)6;B;L&)\\\"(3;B;Gõ))\\x00;B;Gõ));G&)));G&/))6.;B;L&));G&)));G&/)+\\x00(3;B;L&));G&)));G&k)+(3(>(>;\\x00;;F&/)o6ė;H&s)0&\\x0000;H&d)0&00;O&v)0;F&4)00;L&R)0;F&()00;Cì)0;F&<)00(>&\\x00(>	\\\"	\\\";G& ))96L\\\"\\\"	)&\\x00);B;G&));G&)))%6.\\\"\\\"	)&;B;G&));G&)))\\\"\\\"	)&\\x00))(3\\\";G&)\\\"\\\"	)3>	,8Y;G&R)0;G&\\x00)0;G&)0;L&`)0;G&I)0;G&\\\")0;GƗ)0;L&V)0;LĪ)0(>\\n&\\x00(>	\\\"	\\\"\\n;G& ))96)\\\"\\n\\\"	);B;G&));G&)))%6\\\";G&)\\\"\\n\\\"	)3>	,86;B;G&)\\\"(3?,,;B;G&));G&));B;L&).\\x003(3;B;G&));G&)).\\x00>(3;B;G&));G&)));G&6)+(3;B;G&));G&)));G&6));G&6):R;B;G&));G&)));G&*)+(3;B;G&));G&)));G&*));G&*):R;\\x00;;F&/)o\\x00;M\\x00;M;G&;))6¥&\\x00(>	\\\"	\\\";G& ))96Y;M;G&;);B;G&));G&)))\\\"\\\"	)&\\x00)\\\"\\\"	)&),'۸g3;M;G&;);B;G&))\\\"\\\"	)&\\x00)\\\"\\\"	)&),'۸g3>	,8f&\\x00(>	\\\"	\\\";G& ))96(;M;G&;);B;G&));G&)))\\\"\\\"	)'۸'۬g3>	,85;B;Gõ))\\x00;B;Gõ));G&)));G&/))6.;B;G&));G&)));G&/)+(3;B;G&));G&)));G&k)+(3\\x00\\\"\\x00(>.\\x00:w(>\\\"\\x00\\\"(4B\\\"\\x00(4O\\\"\\x00<p(4W	(>\\\";G&>)+\\x00(3\\\";G@)+(3\\\";G&)+(3\\\";Gd)+(3\\\";G&z)+(3\\\";G&N)+(3\\\";G&r)+(3\\\";G&a)+(3\\\"\\x00\\\"\\\"\\x00\\\"	\\x00h2;G&1)\\\"\\x00;G&1))(3\\\"\\x00;G&1))&6	(\\\"\\x00;G&1));F&<)\\x00262\\\"\\x00'(2;G&>))62;G&>));G&)2\\x00/3\\x00\\x007	(2;G&1)\\\"\\x00;G&1))(32;G@))62;G@));G&)2\\x00/3\\x00\\x00F2;G&1)\\\"\\x00;G&1))(3262\\\"\\x00'(2;G&))62;G&));G&)2\\x00/3\\x00\\x00 2;Gd))62;Gd));G&)2\\x00/3\\x00\\x00D2;G&\\\")\\\"\\x00;G&\\\"))(32;G&1)\\\"\\x00;G&1))(32;G&z))62;G&z));G&)2\\x00/3\\x00\\x00D2;G&\\\")\\\"\\x00;G&\\\"))(32;G&1)\\\"\\x00;G&1))(32;G&N))62;G&N));G&)2\\x00/3\\x00\\x00,22B2;G&r))62;G&r));G&)2\\x00/3\\x00\\x00 2;G&a))62;G&a));G&)2\\x00/3\\x00\\x00\\x00 ;B;G&n));G&-)6\\r?\\\"\\x00;B;G&n).\\x003(4:\\\"\\x00;B;G&n))(4:\\\"\\x00(>\\\"\\x00:;G&z)+\\x00(3\\\"\\x00:;G&N)+(3\\\"\\x00:;G&)+(3\\\"\\x00:;G@)+(3\\\"\\x00:;G&r)+(3\\\"\\x00:;G&a)+(3\\\"\\x00:;Gd)+(3\\\"\\x00:;G&>)+(3\\x00 2;G&z))62;G&z));G&)2\\x00/3\\x00\\x00 2;G&N))62;G&N));G&)2\\x00/3\\x00\\x00 2;G&))62;G&));G&)2\\x00/3\\x00\\x00 2;G@))62;G@));G&)2\\x00/3\\x00\\x00,22B2;G&r))62;G&r));G&)2\\x00/3\\x00\\x00 2;G&a))62;G&a));G&)2\\x00/3\\x00\\x00 2;Gd))62;Gd));G&)2\\x00/3\\x00\\x00 2;G&>))62;G&>));G&)2\\x00/3\\x00\\x00B?\\x00;G&R);G&R))(3?\\x00;G&\\x00);G&\\x00))(3?\\x00;G&I);G&I))(3\\x00\\x00\\x00\\\"\\x00B6 ;B;G&n));G&)));G&/));G&&)\\\"\\x00\\\"/3\\r\\\"&)(>\\\"\\x00(>;B;G&n));G&)));G&/));G&)\\\"\\x00B\\\"&\\x00)\\\"\\\"&)u3(>\\\";G·)\\\"&\\x00)(3\\\";G&j)\\\"(3\\\";L&)\\\"(3\\\"\\x00O;G&)\\\"3!2;G&1)\\\"\\x00;G&1))(32;G&)2\\x00/3\\x00\\x00\\x00«\\\"\\x00B6 ;B;G&n));G&)));G&k));G&&)\\\"\\x00\\\"/3\\r&\\x00(>\\\"\\\"\\x00O;G& ))96p\\\"\\x00O\\\")(>\\\";G·))\\\"&\\x00)\\x00\\\";G&j))\\\"&)6A;B;G&n));G&)));G&k));G&)\\\"\\x00B\\\"&\\x00)\\\";L&))\\\"&)u3\\\"\\x00O;G&7)\\\"&/3\\r>,8\\x00\\x00?\\\"c܌!7\\\"\\x00\\\"\\x00B'\\\"Q\\x00\\x00?\\\"c܌!7\\\"\\x00\\\"\\x00B'\\\"Q\\x00\\x00\\x00^\\\"&)(>\\\"\\x00(>\\\"B(>\\\";G&/)\\\"&\\x00)\\\"\\\"&)g3(>\\\";G·)\\\"&\\x00)(3\\\";G&j)\\\"(3\\\";L&)\\\"(3\\\"\\x00O;G&)\\\"32;G&)2\\x00/3\\x00\\x00\\x00p\\\"\\x00B(>&\\x00(>\\\"\\\"\\x00O;G& ))96U\\\"\\x00O\\\")(>\\\";G·))\\\"&\\x00)\\x00\\\";G&j))\\\"&)6&\\\";G&k)\\\"&\\x00)\\\";L&))/3\\\"\\x00O;G&7)\\\"&/3\\r>,8d\\x00\\x00_;I&x)(><p(>&\\x00(>\\\"96,\\\";G&_);j;Gě);j;G&x)13\\\";G& ))F-3-3$>>,83\\\"\\x00%\\\";6	\\x00\\\"\\x00\\x00°\\x00;G&)	\\x00;GĤ)	\\x00;G&<);B;L&));G&)\\x00\\x00;B;L&))X6\\x00<p;G& ))\\x00;G& ))6\\x00;G& ))P\\x00;L&}))6\\x00;L&}));\\x00;L&y))6\\x00;L&y))&\\x00;G&));G&)6\\x00;G&)13;G& ))&\\x00\\x00\\x00G;;G&+)(>\\x00;G&)\\x00\\x00\\\":T6(;-;G&)\\x00\\\";G& ))3(>?\\r\\r\\r\\\"!:(>\\\"\\x00\\x00V(>;F&j)!:[(>\\\"6@\\\":ċ(>&\\x00(>\\\"\\\";G& ))96%\\\"\\\")6\\\";G&);;G&)\\\"\\\")<۞33>,82\\\"\\x00\\x00#?\\x00\\x00\\x00;GÎ))\\x00\\x00;GÎ));G&)13\\x00\\x00\\x00I#(>\\x006>;\\r;G&)\\x00&\\x00;FŽ)[3(\\x00\\x00\\\">6;F&)7H;F&>)7E\\r;;F\\x00)6\\x007>((>#:ă0#:ć0#:Ć0(>\\x00\\\"06;F&A)7H\\x00\\x00p&\\x00(>\\\";G& ))96\\\\\\\")(>&\\x00(>\\\"\\\";G& ))96&\\\"\\\")\\x00;;G&)\\x00\\\"\\\")3;F&)6>,83\\\"\\\";G& ))6\\n;F&>)7E'>,8i	\\x00\\x00\\x00J;^\\x00.\\x00:^(>\\\"6;\\\";G&L))(>\\\"6\\r\\\";G&)13(>;;G&)\\\"#:Ċ3;F&)6;F&5)7E\\x00\\x00\\x00K\\x00(>(>\\x00!K(>**>;F&5)0;F&>)07F\\\"\\rv\\\"¥\\x00>\\\"5\\\"-\\\"f\\\"G\\\"6ź\\x00;G&)6<p$H\\x00\\x00!:g(\\n\\x002\\n=(H\\x00 ; 6\\r;F&)7:&(2\\n!\\n62(H\\x00(\\r\\r2\\n7(>\\x00!:°(>;;Fƃ)62;F&[)4/	(>;;F&l)(>\\\";;FƗ)(>;6?\\\"!:¿6'(>2;F&H)4/\\\"!:¿\\x00;;F&/)o2;F&5)-4Z62;F&)4/\\\"62;F&+)4/#?(;&(>;;F&~)(>2;F&/)-4Z6)!(\\r\\\"\\x00\\\"\\x002\\n!62;F&)4/#2\\n\\x00\\\"\\x00\\\"\\x002\\n!62;F&)4/2\\n214q2A8>(H\\x00\\x00\\x00^#:Ă\\x00!6	6	;G&)\\x00	;GĤ)	;G&<);B;L&));G&)\\x00;B;L&))X6'	\\x00\\x00T*M\\x00A6<p;G& ));F&l)&\\x00!:QF62;F&i)4/;;G&+)<p214qA9\\x00\\x00ȵ(>&\\x00(>;\\\\;G&3);FƆ)-3(>;;G& ))(>;;G&+)(>;F&)(>'(>;B;L&).\\x003(>	;L )13(>\\n\\\"\\n;E&m)13(>\\\";J&O))6ų\\\";G&,))\\\";G&,));G& ));F&4)968.\\\";G&,))&\\x00)(>\\\";G&,))&)(>\\r\\\";6>\\\"\\r!(>\\\"61\\x00\\\"A(>\\\";G&)\\x00\\\"\\\":T6;G&P)\\\"\\\"/3;B;Gġ));G&)\\x00;B;L&));G&)\\x00\\\"\\r;B;Gġ))X6;B;L&).\\x003(>\\\";E&)\\\"\\r-3(>\\r\\\";G& ))\\\"$>\\\"\\r!$>\\\"\\\"(>\\\"\\\"(>\\x00\\\"\\rA6-\\\"6;(>;(>	(>\\\";G&)\\\"0\\\"0\\\"0\\\"\\r0-3(>$\\\";G&)\\\"0\\\"0;L&Q)0;L&Q)0-3(>\\\"\\r(>\\\"	;O)\\\"\\\"/3\\\"\\n;E&m)13(>8ž\\\"\\\";F&l)&\\x00!:QF6\\x00;	;G&)\\\"\\\"3A(>\\\";G&)\\x00\\\"\\\":T6\\\"	;G&P);\\\"/3\\\"	\\x00\\x00Ķ\\\"\\x0066<p\\\"\\x00\\x00!K(46\\x00	\\x00;GĤ)	\\x00;G&<)6\\r2;F&0)4/\\x00;;Fƃ)\\x00;B;L&));G&)\\x00\\x00;B;L&))X\\x00\\x00;L ));G&)6\\r2\\n\\x002A\\x00!(>\\\"6\\\"\\x00(>;B;Gġ));G&)\\x00;B;L&));G&)\\x00\\x00;B;Gġ))X\\x002;F&/)-4Z\\x002;F&5)-4Z6#;B;L&).\\x003(>\\\";E&)\\x00-3(>\\\"6\\x002\\n\\\"2A(>\\\";G&)\\x00\\r\\\";;G&+):T6\\\"\\x00\\x00\\x002;F&)-4Z\\x00\\x00n22\\n2;F&()-4Z6\\r2;F&)4/\\x00\\x00\\x00!	62;F&)4/;A;A214q2QV(>;;;F&/)\\\"42,(> n~\\\",\\x00\\x00\\x00;G&))(>;;G&)\\x00-3(>2;A=\\x00\\\";J&)\\x00;&\\x00;;F&~)\\x002\\n\\x002\\nN;F&)9\\x002\\n!6?\\\";A\\\"\\\"<p6;L&/)(>\\\";L&/)\\x00\\x00W<p\\\";L&N)\\x00;*6'	\\x00\\x00\\x00\\x00\\x00I;F&)!:[(>;;G&)\\\" s;G&Y) t;G&0)p3(>#>$>;D;G&5))6*>;B;L&0)\\\":Z\\r\\x00;F&=)^;F&)P&\\x00!\\\"S\\x00\\x004T\\x004C\\x00\\x00\\x00;;;F&)#04Ü,\\x00\\x00\\x00B;D;G&%);G×)-3(>\\\";G&`)2(3;D;G&5));G&\\r)\\\"3\\\";G&)\\\";G&>)+\\x00@3(3\\x00S\\\"\\x00;G&1))\\\"\\x00;G&1));I&f)\\\"\\x00;G&1));H&2)6(2;G&b));G&t)232;G&)2;G&>)@3(3\\x00\\x00\\x00P\\x00;G&l)6\\r ;G&)39\\x00;G¾)6\\r ;G&)3\\\"\\x00;G&X)6\\r ;G&)3;D\\x00d:Z\\x00\\x00;F&$)!:Q(#:v(\\x00\\x00;F&)!:(;F&0)7:\\x00\\x00\\n#:v  5\\x00\\x00\\x00\\x00\\\"_\\\"H4(+\\x00(:\\r\\x00Y;F&)!:[(>\\\";G&=):6 r;L÷)( r<ۢ( r;NƗ)( r<ۧ(*	#(>\\\"7+\\x00(:\\x00&\\x00(>&\\x00(>#:Y(>+\\x00Í+X+\\x00#:Y(\\x00\\x00\\x00;F&)+\\x00\\x00L#:Y(>\\\"25(>\\\"(\\\";F&)6;F&K)7E\\\"$,2;F&()\\x002&\\x006;F&i)7E\\x00\\x00A'(>\\\"69;F&) #:Y(>\\\"25(>\\\"(\\\";F&)(>\\\"6;F&O)7E8=\\x00\\x00\\x00+\\x00(>*>\\x00\\x00&\\x00o6\\n6*H\\rH\\x00I*\\x00\\x00O#(>\\x00(:#(>\\\"n4X\\\"n4\\x00&-42(>\\\"n4X\\\"\\\"#:´&Q,(>\\\"n4X2\\\"\\\"n4X\\x00\\x006*\\n;D;G&X)2'd:Z;D;G¾)2'd:Z;D;G&l)2'd:Z2 z:l\\x00\\x00;F&)7:\\x00\\x00F&\\x00(>\\\" ;G& ))96\\r \\\"\\x003>,8\\x00;Gì))(>\\\";F&	)\\\";F&0)6;F&)7:\\x00\\x00'&\\x00(>\\\" ;G& ))96\\r \\\"\\x003>,8;F&<)7:\\x00\\x00'&\\x00(>\\\" ;G& ))96\\r \\\"\\x003>,8;F&()7:\\x00\\x005;F&$)!:Q(>\\x00 \\x00\\\"\\x00 o6\\x00 (\\x00(\\\"(#:v(\\x00\\x00R?MMM;B;L&));B;G&))6:;I&$) r;I3)(;D;G&O)#:b;G&u));G&=)62;L&)2(3\\x00\\x00Ď?ĉĉĉ;;G&);D;G&O))23;F&)6;F&j)7E;B;L&));B;G&))6Ò;;G&);D;G&O))23;F&)(>.\\x00:](>\\\";O§)\\\";G&8)13;Fƍ)532;E&Z)\\\";L&^)13(>;D;G&O)#:b;G&u));G&=)6\\n\\\";L&)\\\"(3\\\"$;\\x00;D;G&O));G& ))&;B#:@);L&u))6\\r&;CË)%;;F&4)\\x00;;F&\\x00)6;B;Jþ);O&h)3\\x00\\x00\\x00#:(>\\\" !:48\\\" !:48\\\"\\x00\\x00H?AAA2!:Ā(>\\\"\\x00\\\";G& ))&\\x006'\\\"#:´.(>\\\"6\\\"!:r(>\\\"14 \\\"14\\x00\\x00j\\x00;FƏ)F(>#:Y\\\"(>;E&Z)\\\".:];L&^)13(>;3;G&)22;G& ))&53;L÷)6;L&)$>&;F&?)!:Q6;E¦)$>\\\"\\x00\\x00<p\\x00\\x00&;D;G&O)\\x00;G&+)#;JÌ) y!\\r(3\\x00\\x00\\x00\\x00\\x00*\\x00\\x00\\x00;G& ));F&)_&\\x00=6\\x00!O(\\x00\\x00!N(\\x00\\x00\\x00\\x00Ć&\\x00(>;F&<)E>14%(\\x00;6(!:2(>\\\";G& ));G& ))96\\r;F&4)E>\\\"(!+(\\x006(\\x00\\x0014%(\\x00#:(>\\\"&\\x0048\\\"\\\"4T\\\"\\x004V;F&4)!:ā(>\\\"\\\"4V;G& ));F&)J6\\\";F&):±\\\"#:|&\\x00A:¼4V!+(\\\"14%(;F&<):X(>\\\"\\\"&\\x00/48\\\"n4\\\"14%(>6\\n\\\":¼(>;G&h)\\\"!:~\\x00\\x00X\\x00;G&)&-3(\\x00\\x00!:¸(>6\\\":»(>\\\"6;\\\";G&);F&<)-3!:X(>\\\"!:r(>\\\"\\\"14=6;\\\"\\x00\\x00*\\x00-(>\\\"6\\\"14(>\\\";F&<)&\\x006\\r\\\"14&\\x00\\x00?\\x00Q0(>\\\"\\x00\\x00ÿ\\x00-(>\\\"6\\r\\\"14(>\\\";F&<)&\\x006\\r\\\"14&(>\\\"14&(>\\\"14&(>\\\"#:|&\\x00A:»(>\\\"\\\";F&):±\\\";F&4)6\\\"!:<(>6\\\"7;F&E)!:Q(>\\\"&\\x00\\\";F&l)Q:r(>\\\"14¹6h\\\"14(>	\\\"14&(>\\n&\\x00(>\\\";G& ))96D?:::\\\")(>\\\"^\\\"	6)\\\"&\\\"	;F&%)(>\\r\\\"\\n&\\x00\\\"\\r;F&)Q:r(>\\\"\\\"4º>,8Q8o'\\x00\\x00\\r\\x00(>\\n(>\\\"_\\\"]\\\"(\\\"2\\\"Ü(>;B;L&0)\\\":Z\\\"7\\\"7:Č\\\"7:Ď\\\"7*\\\"7$\\\"72\\\"7J\\\"7L\\\"7P\\\"7S\\\"7:ĉ\\\"7:Ě\\\"7R\\\"7C\\\"7:Ē\\\"7:ě\\\"7U\\\"7:ę\\\"7:Ĕ\\\"7T\\\"7Q\\\"7:ğ\\\"U2\\n;G&)2-3(>&\\x00(>\\\"\\\";G& ))96\\r\\\"\\\")n4_>,8;6	*	&7:2;F&):l;;Fû)6*A\\x00\\x00b'(*	2\\n;G&)2-3(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")H(>\\\";A6*>>,8&;F&4)7:;;FƖ)6\\n A;F&;):S*:µ\\x00\\x002\\n;G&)\\x003\\x00\\x002;G&)\\x003\\x00\\x002#:Y!::Đ\\x00\\x00&62;G&)0-3(>2(>\\x00\\\"\\x00\\x00\\nÙ;F&E)!:Q(>;F&l)\\\":(>&\\x00(>\\\";G& ))96¬\\\")(>\\\"P\\x006?	(>\\\"!&\\x006;L&n)\\\"^!:W(>\\\"6U\\\"&\\\"^;F&%)(>;F&)\\\":(>\\\"\\\"4S\\\"14%(>\\\";G& ))\\x00\\\"!&\\x006\\\"!;L&n)\\\"^\\\":U\\\";G& ))6\\\"\\\"^4T\\\"\\\"4V>,8¹\\\"\\x00\\x00^;D;Gñ);G×)-3(>\\\";G& ))&5(>\\\"&\\x00J65\\\"\\\");G&);L&-)-3;L&$)6\\\"\\\");I&\\x00));G&t)\\\"\\\")3>I8<*M\\x00\\x00\\x00\\x00\\x00\\\"_\\\"H4(\\r*\\x00\\x00+;F&()!:Q6!&\\x00(>;;F¾)6;F&Z)(>*' 3\\\":S\\x00\\x00g;B;L&))(>\\\"\\x00\\\";Gî))\\x00#:b;G&o));G&) v-3;F&)=64#:b!:đ(>\\\"\\\"? v:Ĝ(4?\\\"!:ĕ(>\\\";Gî)\\\";E&B))<p\\\"g3\\x00\\x00\\x00\\x00ò;F&4)!:(>\\\"6\\r#:b(>\\\"&\\x00);G&)6%;;G&)\\\";G&u));G)\\\";L&))\\\"L3(>\\\"&);G )(>;;G&+)(>\\\";G&o));G&)\\\"-3;F&)=6\\\";G&Q));/(>\\\";G&Q))\\\";G&o))(>\\\"62;F&/)!:ė!(>;F&?)!:!:V(>	\\\"!:g(>\\n\\\"\\n\\\"\\\"	A8>(>&\\x00!:(>*(\\\"6	\\\"\\\">\\\"7>À#:b;G&F));G&):³&)(>#:b;G&o))(>\\x00;G&0):³&)(>\\\"\\\"6w;B#:@)(>\\\";G&9))(>;;FÇ)\\x00\\\"\\x00;;G&)\\\";L&&)3;F&)=\\\"69;;G&)\\x00;G&0)3;F&)6\\n;G&.)$\\x00;G&0)$\\x00 v;G&+)#:Y$\\x00#:b;G&)\\x00\\\"3\\x00\\x00;D;G&%);L&3)-3(>\\\";L&);H&u);I&u)/3\\\";G)\\x00(3;D;G&%);G&J)-3(>\\\";G&);(3\\\";G&,)(3\\\";G&\\r)\\\"3\\\"&(4Ą\\\";G&));L&);G&)(3;D;G&5));G&\\r)\\\"3\\\";L&()n3\\x00\\x00\\x00\\x00#:|:·(>;Gą);G&+)\\\"\\x00\\x00	­\\x006<p;;G&)\\x00;G&.)3(>(>&\\x00(>\\\"\\\";G& ))96m&\\\"f6P;F&4);F&	):&!:Ė(>\\\"<p!:Ğ(>;LÌ);G&})\\\"!:X(>\\\"!:~(>\\\";G&)\\\";G&+)\\\"3\\\";G&)\\\"\\\")3>Y8z\\\";G&();G&.)-3\\x00\\x00	\\x00#:|:Ę\\x00\\x00ŏ;;F¢)6\\n	0<p0&\\x000\\x00!:(>\\\"\\x00\\\"&)(>\\\"6\\n	0<p0&\\x000<p(>&\\x00(>\\x007(>\\\";LË))(>\\\"6¯&\\x00(>\\\"\\\";G& ))96\\\"\\\")(>	\\\"\\\"	&\\x00):T6\\\"	&)6\\\"(>t\\\"	&)\\x00\\\"	&)6H;;G&)\\\"	&);G&)3(>\\n&\\x00(>\\\"\\\"\\n;G& ))96 \\\"\\n\\\");F&):V&5(>&\\\"fE>>Y8-\\\";G& ))&\\x00\\\"&\\x006\\n'0\\\"0\\\"0>Y8ª\\x00s<p(>;;G&)\\\"-3(>\\\";L))(>\\r\\\"\\r\\x00\\\"\\\"\\r:ē6\\r'0\\\"0;F&b)0	0<p0&\\x000\\x00\\x00\\rɅ*¤6#(\\x006;F&()4/;F&)4/;F&?)4,;F&4)(>;F&)-4Z6&E>\\x007(>\\x00!<(>\\\"(><p(>\\x00!7(>\\\"&\\x00)\\x00\\\"&);G& ))&\\x006\\n\\x007!4(>;F&+)-4Z6'\\\"&\\x00)\\x00\\\"&)&\\x006\\\"\\\"&)5(><p(><p(>6#?(;F&)4/\\x00@(>\\\"\\\"QV(>	;;\\\"\\\"	42;\\\"&Q,(>\\n;(>;F&)0;F&/)0;F&5)0-4g6 n(><p(>\\\";G& ))&\\x006F\\x00i(><ܛ$>\\\";G& ))&\\x006\\\";G&.)$>\\\"$>;G&.)\\\";G&+)\\\"\\n$>\\x00'$>§\\\";G&+)\\\"\\n(>\\\"6\\\";G&.)\\\"(>;;F&4)\\x00<\\x00J!:<܊:²\\x00;F&)\\x00J;G&);G&0)-3\\x00;F&)\\x00J;G&);G&)-3\\x00\\x00N;F&4)\\x00N&6\\x00i\\\"\\\":{\\x00'(>\\x00J!:\\\":{\\x00'(>\\\">\\\";G&+)\\\"\\n³G\\x00\\x00/;F&$)4/\\x00;AQV(>;;;F&<)\\\"42,(>\\\"\\x00\\x00#:ĝ(>\\x00;A\\\"0Q/6\\\"\\x00\\x00	ŉ\\x006<p0\\x000\\x00(>\\x00;G&);G&.)-3(\\x00(><p(>&\\x00(>\\\"\\x00;G& ))96°\\x00\\\")(>\\\";G&);G&+)-3(>\\\";G& ));F&4)\\x00\\\"&\\x00);\\\"&\\x00) n6\\\"6<p0<p0\\\"&)(>X\\\";G& ));F&4)\\x00\\r\\\"&\\x00);LÌ):T67\\\";G& ));F&4)\\x00\\r\\\"&\\x00);Gą):T6\\r\\\"&)!6(>\\\";G&)\\\"3>,8½\\\"6@\\\";i;G&o));G&)&-36;90;/!:°0\\\"!:(>\\\"6\\\"6\\r\\\";G&)\\\"3\\\"0\\\";G&();G&.)-30\\\"0\\x00\\x00!\\x00?!;(>\\\"&\\x00)6\\n\\x00\\\"&\\x00)(47\\\"&)\\x00\\x00?\\x00<p6\\x00;;A	;G&)6\\x00!:g(6\\x00N;F&)6!>t#:ħ:į617?:{'(>N&6\\\";;G&)i\\\"3!>\\x00\\x00f\\x00?6[\\x007(>\\x00!<(>\\x007\\\"=(>\\\"6,<p(>\\x00N;F&4)6\\x00i(>\\\"\\x007\\\":{\\x00'\\x00J!:\\\":{\\x00'\\x00J\\x00\\x00\\\", ;F&%)&\\x00Z#:a;F)F!:\\n;F)F\\x00\\x00Ď\\x007!:(>\\x00!<(>;\\x00;F&)\\x00J;G&);G)-3=F;;F&4)\\x00<\\x00J!:<܊:²\\x00.;F&)\\x00J;G&);G&0)-3=;F&)\\x00J;G&);G&)-3=6%;F&_)4/\\\";G&);J&=);G&y):K<p3(>\\\"!:!:(>;F&+)-4Z6\\\";G&);O&p);G&y):K<p3(>\\\"!:!:(>;F&)-4Z6\\\"!:Ĥ(>;F&H)-4Z6\\\"!:Ġ(>\\\"\\\"(>\\\"!:X\\x00\\x00\\x00ă;Lö)!:W(>\\\"6\\r;F&{);Lö)&:U;F&g)!:[<p(>\\\";G&);G&)-3(>(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")6\\\";G&)\\\"\\\")3>,8'(>	?\\n#>(>	\\\"	;G& ))&\\x006w;F&)!:[<p(>\\\" x(>\\\"!:g(>\\r#(>\\\";F&)4/\\\"\\r\\\"&\\x00A8>(>\\\"	;G&();\\\\;G&3);F&)-3-3;G&)&\\x00;FƁ)3(>\\\"#:|:·(>\\\"\\\":Ī\\r\\x002;G& ))(>\\\"&\\x006\\x00;G&)+\\x00(3\\x00B&\\x00(>\\\"296%2\\\")\\x00\\x00;G&)2\\\")-3;F&)=6\\r>,8-\\x00\\x00;G& ))\\x00(3\\x00\\x00\\x00Ò;B;G&?))(>\\n;B#:@)(>;B;Gí))(>;M;G&H))6l;G&H)0;G&)#>-3;G&)\\\"#:@>-3;G&);D;G&e)>-3;G&)\\\";Gí)>-3;G&)#>-3;G&)#>-3;G&);LÎ)0-3(>\\r\\\"\\r=<۵;G&H)0;G&)+\\x00#U-3;G&)#>-3;G&)#>-3;G&);LÎ)0-3(>\\r\\\"\\r\\x00¿;M;G&H);B-3(>;M;L&\\r)\\\"-3(>(>\\\"7&\\x00(>\\\"\\\";G& ))96}\\\"\\\")(>;B\\\")(>	\\\"	;L&)\\\"	;B\\x00\\\";C&u)=6J\\\"\\\"	!>(>\\n\\\";G&)\\\"\\n3\\\"	;G&)6;B\\\");G&)))7>\\\"	;G&)6;B\\\")7>>,8\\\";E&A)13;GÂ)\\x00;G³)\\x00\\x00Ů;M;G&H)\\x00-3(>;M;L&\\r)\\\"-3(>&\\x00(>\\\"\\\";G& ))96ŀ\\\"\\\"\\\"))(><\\\"%\\x00\\\";G&));A6C<p(>\\\";G&));G&)6;L&x)\\\";G&))(>2;G&)2\\n;N&E)\\\"\\\")\\\"3<P\\\"%\\x00\\\";G&P));A6C<p(>\\\";G&P));G&)6;L&x)\\\";G&P))(>2;G&)2\\n;H&)\\\"\\\")\\\"3;G&,)\\\"%6x<p(>\\\";G&,));G&)\\\";G&,));G&<)\\\";G&,));GĤ)6;L&x)\\\";G&,))(>2;G&)2\\n;NĨ)\\\";G&,))!;G&w)\\\"\\\")\\\"3>,8ō\\x00\\x00\\x00Ɗ;M;G&H)\\x00-3(>;M;OƗ)\\x00-3;G&T))(>\\\";G&));B%6;M;GÄ)\\\";M;G&H)\\\";G&)))-33(>;M;L&\\r)\\\"-3(>(>\\\"7&\\x00(>\\\"\\\";G& ))96Ĉ\\x00\\\"\\\"))(>\\\";L&)6ë;G&#)\\\"\\\");GÂ)\\\";G³)(>\\\";G&)6\\\";G&)\\\";J&F)\\\"3©\\\";G&)	\\\";G&<)\\\"\\\";A6\\\";G&)\\\";N&h)\\\"!:3m\\\";G&)6b\\\";G&)\\\";NÎ)\\\"36J\\\";G&#)\\\"\\\")(>	&\\x00(>\\n\\\"\\n\\\"	;G& ))96\\\";G&)\\\"	\\\"\\n)3>\\n,8 \\\";G&)&53>,8ĕ\\\";E&A)13\\x00\\x00;GÂ)\\x00;G³)\\x00\\x00<p(>&\\x00(>\\\"\\x0096\\n<ܘ$>>,8\\\"\\x00\\x00	ë(>\\\"7>KØ?ÓÓÓ<p(>\\\")(>\\\";G&)6;L)\\\"<p!:(>$\\\";G&<)	\\\";GĤ)6;L)\\\"<p(>\\\";G&)!\\\"!;G&w)\\\"\\\"3\\\";G&)\\x00;F&/)o6M\\\"!\\x00\\\";B;Gõ))X68\\x00\\\";F&<)A(>&\\x00(>\\\"\\\";G& ))96\\\";G&)\\\"\\\")3>,8 \\\"\\x00\\x00;B(>\\\";G&e))(>;O&t)0(>\\\"\\x00\\\";G&2))\\x00\\\";G&2));G&A))6R;D;G&2));G&A)13(>;L&E)0;G&$)0;GĊ)0;L&Z)0<0;G&)0;L&.)0;O&)0(>\\\"\\\";N&)\\\"d	\\\"\\x00\\x00Ǧ;B(>\\\";G&e))(>\\\";Gí))(>;E¶)0(>;Gĉ)0;G»)0;GÃ)0;Gā)0;OĮ)0;J&D)0;E&\\\")0;E&*)0;E&J)0;E&K)0;C&)0;C)0;H&L)0;N&7)0;N&*)0;G)0;OĚ)0(>\\\"\\\";J&N)\\\"d	\\\";L©))6C;G&$)0;E&#)0;E&G)0;H)0;N&>)0;O&)0;G&)0(>\\\";L©))\\\";Cþ)\\\"d	\\\"6x;G&)0(>\\\"\\\";N&)\\\"d	\\\";G&2))6U;E&G)0;E&#)0;L&\\x00)0;L&)0;JĚ)0;O&c)0;Lā)0;LČ)0;C&b)0;OT)0(>	\\\";G&2))\\\"	;NĪ)\\\"d	\\\"6x;L&,)0;E&?)0;E&=)0;L&K)0;L&+)0;L&)0;G&$)0;G&)0;C&)0(>\\n\\\"\\\"\\n;HÃ)\\\"d	\\\";Gé))6%;G&)0;Iµ)0(>\\\";Gé))\\\";NĚ)\\\"d	\\\"\\x00\\x009&\\x00(>\\\";G& ))96'\\\")(>;G&)\\\";G&w)\\x00\\\")3>,84\\x00\\x00\\x00\\\";B&\\x00A8;B0202\\n020(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")\\x006'>,8	\\x00\\x00\\x00\\x00\\x00Đ\\\"\\x000(>\\\"+\\x00(\\n­\\\"+(\\ñ\\\"+(\\nƂ#>(>;H&l);G&y):K(>	<ܚܓ<܃ۣ<ܙܐ<ۨۺ<ܜ܄<۰[<܅ۼ(>\\n?³¹¹\\r\\x00!>!>7>\\\"1\\ñ(>\\\";A6\\n;N&$)(>\\\";G&)6\\n;J&n)(>w\\\";G&<)	\\\";GĤ)6\\n\\\"!:\\\\(>W\\\";G&)6\\n\\\"!>(>B\\\";L&)6<ܒ\\\";G&)13!>(>#\\\";G&)6\\n\\\"!:(><۫\\\"<p!>(>\\\";I&v)\\\"\\x00&\\x00\\x00(3\\\"\\x00&\\x00)(3\\\"\\x00&(3\\x00\\x00\\rԢ\\x00&\\x00);F&)6e\\x00&)721\\ñ(>\\x00&);F&)62\\\"a\\n­9\\x00&);F&+)62\\\"\\n­!\\x00&);F&\\\")62\\\"b\\n­	;C)!:^TҰ\\x00&\\x00);F&4)\\x00&\\x00);F&()6Ǡ\\x00&)721\\ñ(>\\x00&)721\\ñ(>\\x00&);F&>)6\\r2\\\"\\\"\\n­Ơ\\x00&);F&)6\\r2\\\"\\\"5\\n­Ɔ\\x00&);F&z)6\\r2\\\"\\\"F\\n­Ŭ\\x00&);F&[)6\\r2\\\"\\\"s\\n­Œ\\x00&);F&_)6\\r2\\\"\\\"D\\n­ĸ\\x00&);F&)6\\r2\\\"\\\"\\n­Ğ\\x00&);F&H)6\\r2\\\"\\\"_\\n­Ą\\x00&);F&i)6\\r2\\\"\\\"\\n­ê\\x00&);F&9)6\\r2\\\"\\\"9\\n­Ð\\x00&);F&	)6\\r2\\\"\\\"J\\n­¶\\x00&);F&M)6\\r2\\\"\\\"o\\n­\\x00&);F&K)6\\r2\\\"\\\"\\n­\\x00&);F&m)6\\r2\\\"\\\"=\\n­h\\x00&);F&)6\\r2\\\"\\\"\\n­N\\x00&);F&a)6\\r2\\\"\\\"\\n­4\\x00&);F&)62\\\"\\x00\\\"\\n­\\x00&);F&)62\\\"\\\"\\n­ʶ\\x00&\\x00);F&)69&\\x00(>\\\"\\x00&);G& ))96\\x00&)\\\")721\\ñ(>>,8*2\\\"\\n­ɰ\\x00&\\x00);F&/)692\\x00&)721\\ñ6\\x00&)721\\ñ\\x00&)721\\ñ\\n­Ȫ\\x00&\\x00)&\\x00602\\x00&)-\\nƂ(>&6\\n2\\\"\\n­22&\\x00)\\\")\\n­ǰ\\x00&\\x00)&\\x00&\\x00);F&0)6q\\x00&)721\\ñ(>\\x00&)\\x00&)21\\ñ(>	\\x00&)&\\x00(>\\n;F&4)62\\\"\\\"	\\\"\\n.\\n­2\\\"\\n\\\"\\n\\x00\\\"6\\\"\\\"	);A\\n­Ũ\\x00&\\x00);F&<)6\\r2\\x00&)\\n­Ŏ\\x00&\\x00);F&=)6!22\\x00&)-\\nƂ2\\x00&)-\\nƂ:K\\n­Ġ\\x00&\\x00);F&)6	2\\n­Ċ\\x00&\\x00);F&)62\\x00&)-\\nƂ(>2\\\"\\n­å\\x00&\\x00);F&?)\\x00&\\x00);F&))6¦(>&\\x00(>\\\"\\x00&);G& ))96#\\\"\\\";G& ))\\x00&)\\\")721\\ñ(3>,83\\x00&);F&4)21\\ñ(>\\\"&)(>\\n\\\"2X6/2\\\"\\n	\\\"\\n\\x00\\\"&)6\\\"&);G&&)\\\"&\\x00)\\\"3;A\\n­2\\\";G&&)\\\"3\\n­%\\x00&\\x00);F&)62\\x00&)\\n­	;H&)!:^T\\x00\\x00\\x00;H&)(>+\\x00(>+(>\\\"\\x00Ĥ<p(>&\\x00(>\\n\\x00;G&);NÂ);G&y):K<p3(\\x00\\\"\\n\\x00;G& ))96æ2;G&)\\x00;G&_)>\\n^-3-3(>2;G&)\\x00;G&_)>\\n^-3-3(>2;G&)\\x00;G&_)>\\n^-3-3(>2;G&)\\x00;G&_)>\\n^-3-3(>	\\\";F&4)f\\\";F&<)tP(>;F&)\\\";F&<)f\\\";F&4)tP(>;F&()\\\";F&)f\\\"	P(>;\\\\;G&3)\\\"-3$>;F&,)\\\"=R;\\\\;G&3)\\\"-3$>;F&,)\\\"	=R;\\\\;G&3)\\\"-3$>8ó\\\"!(>\\\"\\x00\\x00Č<p(>&\\x00(>&\\x00(>&\\x00(>&\\x00(>&\\x00(>\\\"\\x00;G& ))96Þ\\x00;G&!)\\\"-3(>\\\";F&)96;\\\\;G&3)\\\"-3$>>,±\\\";Fñ)\\x00\\\";F&1)96>\\x00;G&!)\\\"&-3(>;\\\\;G&3);F&9)\\\";F&)f;F&)\\\"P-3$>;F&4)$>_\\x00;G&!)\\\"&-3(>\\x00;G&!)\\\";F&4)-3(>;\\\\;G&3);F&)\\\";F&=)f;F&)\\\";F&)fP;F&)\\\"P-3$>;F&()$>8ë\\\"\\x00\\x00\\x00S(>&\\x00(>\\\"\\x00;G& ))96\\\"\\\"\\x00;G&!)\\\"-3(3>,8#\\\"&\\x00)(>\\\";G&)&-3(>(\\\"2>2z&\\x00(>\\\"\\x00;G& ))96h\\x00\\\")26J(>\\x00;G&)\\\";F&4)\\x00\\\"&)\\\";F&4)3\\\";G&)\\\"3\\x00\\\"&);F&4)$>;G&)\\x00\\\")3>,8u\\x00\\x00\\x00\\x00E2	;E3)&\\x00(32	;G&)\\x00-36;G&[)\\x00;G&)2	+\\x003;G&[);G&[)\\x00;G&[)\\x00E2\\n\\x00)(>\\\";G&)6\\\",<܂;E&V)\\x00;G&!)&\\x00-3;G&);F&)-3;G&);FƂ)-3\\x00\\x00\\\"\\x00\\\"\\x00;G& ))\\x00(3\\x00\\x00-\\\"\\x00\\\"\\x00;G& ))&5)(>\\\"\\x00;G& )\\\"\\x00;G& ))6&&\\x00S3\\\"\\x00\\x00?(>&\\x00(>\\\"\\x00;G& ))96\\\"\\\"\\x00\\\");FČ)D(3>,8#;\\\\;G&3));G&&)\\\"3\\x00\\x00'\\x00Õ(>;G&5)0;J&.)0(>;E&U)0;E&)0;E&)0;J&Y)0(>;L&c)0;E&$)0;O&)0(>;E)!>(>;J&h)!>(>&\\x00(> ;B;L&A))(>!(>\\\";^\\x00;^;L&e));G&<)6\\n;^;L&e))(>#;Cã)!:K(>$;HĪ)!:K(>%(>&\\x00;F&+)^&;F&4)PP&\\x00!\\\"_\\\"H\\\"S4]\\r\\x00\\x00\\x00e*2&;G& ))&\\x006\\r2!6;E&);G)2'&;G&l)2&;LÑ)2'&;L&@)2'&;G&X)2&;G&J)2'&\\x00\\x00#6\\r\\x00&4T\\x007\\r\\x007\\x00\\x00q;F&Y)!:[(>\\\"6b;k;G&\\n)\\\"-3(>(>&\\x00(>\\\"\\\";G& ))96;\\\"\\\")(>\\\"\\x00\\r\\\"\\\":t;F&)6\\\";G&)\\\"32&;G&)\\\".:K3>,8H\\x00\\x00O2&;G& ))&\\x006?;B;G&?));G&Q))!:(>&\\x00(>\\\"2&;G& ))962&\\\");G&)\\\"-36'>,8&	\\x00\\x00T(>\\x00;G&);G&)-3(>&\\x00(>\\\"\\\";G& ))96*\\\"\\\"\\\");G&)\\\";F&)96\\n;G&4)\\\"\\\"(3>,87\\\"\\x00\\x00\\x00;G&D))\\x00;E&))\\x00\\x00ë&\\x00(>\\\"\\x00;G& ))96Ù\\x00\\\")(>\\\"\\\";L&q)6»\\\";L&U):T\\n\\\";L&P):T67\\\";G& ));F&)6%\\x00\\\"<܀;\\r;G&)\\\"\\\";G& ));F&)5&3(3l2\\\")(>\\\";A6\\n\\x00\\\"\\\"(3R;;G&)\\\";G&#)3(>\\\"&\\x0068;\\r;G&)\\\"&\\x00\\\"[3(>2\\\")(>\\\";A6\\x00\\\"\\\";\\r;G&)\\\"\\\"3(3>,8æ\\x00\\x00	þ\\x006\\x00;G&)<ܐ-3(>(>\\\";G& ))&5(>\\\"&\\x00J\\x00\\\";G& ));F&()96½\\\"\\\")!:ģ(>\\\"6¦(> s\\x00;;G&)\\\" s3;F&)6\\n;L&q)(>X;);G&)\\\"2$3(>\\\"\\x00\\\"&);G&)6\\n\\\"&)(>+;);G&)\\\"2%3(>\\\"\\x00\\\"&);G&)6\\\"&)(>\\\";G&)\\\"6\\\"\\\"3\\\";G& ));F&()6>I8Ô\\\"\\x00\\x002#6?;^;L&e)\\x00(3\\x00\\x00;F&.)7;^\\x00.\\x00:^(>\\\"	\\\";G&L))6\\r\\\";G&L))(>2#7\\\"6\\r\\\"!\\n(>\\\"7	&\\x00(>\\\"\\\";G& ))969\\\"\\\")(>\\\";G& ));F&)6;\\r;G&)\\\"&\\x00;F&)[3(>\\x00\\\"4C>,8F\\x00\\x00¡2;G& ))&\\x006\\x00&\\x004T\\r2;G& ));F&):(>\\x00\\\"4T&\\x00(>\\\"\\\"96d2\\\")(>\\x00\\\"44T\\x00\\\"4C\\x00\\\"D4T\\\"4;F&4)6\\x00\\\"4T\\x00\\\"I4T\\\"4&6\\x00\\\"4T\\x00\\\"\\\\4T>,8k\\x00\\x00Ă\\x00;G&s));G&f)13(><p(>\\\"B\\\"(>;E&)(>t\\x00;G&b))60\\x00;G&b));G&s));G&f)13(>\\\"<ۥ\\\"<Н6\\n\\\"(>\\\"(>8\\\"(><ܔ(>,\\x00;G&);G&)-3(>\\\";L&c)\\\";E&$)6\\\"(>\\x002\\\")\\\"(>\\\"6\\r;E&:)\\\"$>\\x00;G&)<ۿ-3(>\\\"6;G&)\\\"$>\\\";G& ));F&)6;\\r;G&)\\\"&\\x00;F&)[3(>\\\"\\x00\\x00\\x00_\\\"\\x00(44\\\"\\x00\\x00!(4F\\\"\\x00\\\"\\x00F!(4\\\"\\x00&\\x00(4D\\\"\\x00#:Y(4U\\\"\\x00&\\x00(4I\\\"\\x00&\\x00(4\\\"\\x00&\\x00(4\\\"\\x00&\\x00(4\\\\\\\"\\x00+\\x00(4R\\\"\\x00+(4d\\\"\\x00+(4\\x002#:Y\\\"\\x00U5(>\\\";F&)s!:(>\\\";F&)6;F&)(>\\\"\\x00\\\"(4D\\x00\\x002\\\"\\x00F;G&,))\\n\\\"\\x00F;Gÿ))<p;G& ))(\\x00\\\"\\x00\\x00;F&):(4\\x00\\x00\\rƘ\\\"\\x00F;G&A))6\\r\\\"\\x00F;G&A)13(>\\\";G&))!:(>\\\";G&$))!:(>\\x00;J&f))\\\"\\x00F;LČ))&\\x00(>\\x00;J&/))\\\"\\x00F;Lā))&\\x00(>\\\"\\\";G&))&\\x00\\\";G&$))&\\x00\\\"&\\x009\\\"&\\x009\\\"\\\"\\\"\\\"6\\r\\\"&\\x00J\\x00\\\"&o(>\\\"&\\x00J\\x00\\\"&o(>\\\"\\\"o\\x00\\\"\\\"!:\\n&5J(>	\\\"\\\"o\\x00\\\"\\\"!:\\n&5J(>\\n\\\"\\\"\\\"	\\\"\\n6#\\\"\\x00\\\"\\\"	\\x00\\\"\\\"\\n6;F&();F&4)(4\\\\3\\\"\\\";F&4)s5!:;F&)9\\x00\\\"\\\";F&4)s5!:;F&)96\\\"\\x00&(4\\\\\\\"\\\";F&	)ss!:\\n;F&	):(>\\\"\\\";F&/)ss!:\\n;F&/):(>\\\"\\x00\\\";F&	)F\\\"(4\\x00\\x00'(>2;G& ))&\\x006J2&\\x00)(>\\\"F\\x00!\\x00\\\"4(>&\\x00#:Y\\\"U5;F¶)J(>\\\"\\x00\\\"6	\\\"(>	(>\\\"63\\x00.(>2;C&`)\\\"32;G& ));F&)6\\n2;G&C)n3\\\"#\\\"}\\x00\\x007\\x00\\x00\\x00;B;Gõ))X\\x00\\x00;G&s))\\x002\\x00;G&s));G&f)13:t;F&)\\x00\\x00\\x00F#:Y<&\\x00I(\\\"\\x00\\x00Q\\x00;G&s));G&f)13(>\\\";G&J)6&\\x00;G&);G&)-3(>\\\"\\x002\\\":t;F&)2\\\":t;F&)\\x00\\x00G\\x00!!6\\r\\x00&(>\\\"}6\\\"2 &\\x006\\n\\\"#2 (4U\\\"#n4R\\\"#\\x004&\\x00( \\x00\\x00#:Y( \\x00\\x00v\\x00!(>\\\"!6\\r\\\"!6\\r2\\\"2\\\"F\\\"6\\\"7\\x00;F&4)(>\\\"}6\\\"#2\\\"(4U\\\"#n4R\\\"#n4d\\\"#2\\\"I(4I2\\\"\\\"#(4<\\x00\\x00\\x00!(>\\\"!6\\\"7\\x00\\x00.2\\\"\\x002\\\"<62\\\"<n4R2\\\"<n4d2\\\"<2\\\"I(4I(\\\"\\x00\\x002\\\"62\\\"4I,\\x00\\x00\\x00\\r;F&L)\\x00(\\x00\\x00 \\x004/\\x00\\x00!&\\x00(>\\\"\\x00;G& ))96 \\x00\\\")4,>,8\\x00\\x00O ;A=6 ?77;B;G&	)#:º.3(>;B#:@)#:)(>\\\"6\\\"#:ĥ)(>\\\"\\x00\\\"#:ġ)(>\\\";A@\\x00\\x00& \\x00:t;F&)6\\r  ;G& ))\\x00(3;F&/)7E\\x00\\x00\\x00(:\\x00\\x00J\\x00a&\\x00(>7<p(>8&\\x00(>9&\\x00(>:&\\x00(>;&\\x00(><&\\x00(>=&\\x00(>>&\\x00(>?	(>B&\\x00(>C&\\x00(>D(>E\\x00;F&()^&P&\\x00!\\\"_\\\"H\\\"S4]\\r5\\x00ª*+;6%*5*.****;B;C&S)2 :Z;D;G&/))6!;D#:ĩ2:Z;D#:Ħ2:Z;D#:ī2:Z;B;E&)2\\r:Z**	;B;G&n))\\x00;B;G&n));G&)));G&/))(>\\\"6;B;G&n));G&)));G&/)+\\x00(3\\x00\\x00#:Ģ6;F&])7H2;G&&)\\\"\\x00\\\"3\\x00\\x00*5*+*$*;B;Gē)23&\\x00/3**&;6E;B#:½);A(A;G)0;G&X)0;G&l)0(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")2&>,8**2;FƎ):l*\\x00\\x00ú; 6*6*;B;Gē)2&&\\x00/3*(* #:(>&\\x00(>\\\" ;G& ))96\\\" \\\")4®>,8 n4\\x00;4T\\x002;4T\\x00294T\\x002:4T\\x002748\\x00284\\x002?48\\x002=4T\\x002>4T\\x00;B;Gĉ))49\\x00;B;G»))49\\x00;B;GÃ))49\\x00;B;Gā))49\\x00 48\\x00 48\\x00\\\"14%4V\\x00 14%4V\\x00;F&L)49\\x00\\x00\\x00f;#:Ĩ6^?YYY;D;G&%);G×)-3(>\\x006#:Ĭ(\\x00\\\";G&`)#:ĭ\\x00#:Į(3\\\";G&)+\\x00(3\\\";G&N)+(3;D;G&5));G&\\r)\\\"-3(>\\x00;F&)7E2;G&b));G&t)23\\x00\\x002;G&b));G&t)23\\x00\\x00ņ;B#:ĵ);G&)R;F&)7E;B#:Ŀ0<۳0R;F&)7E;B#:İ0#:Ĳ0#:ı06;F&=)7E;FČ)7H;B#:ķ0#:ĸ0#:ĳ0#:Ĵ0R;F&0)7E;B#:Ļ0#:ľ0R;F&))7E;B#:Ĺ0#:Ķ0#:ļ0#:Ľ0R;F&)7E;B#:ĺ0#:ŏ0#:ņ0#:Ŋ0#:Ł0R;F&)7E;B#:ō0#:ŀ0#:Ń0#:Ŏ0#:ŋ0#:Ň0#:ň0R;F&+)7E;B#:ł0#:ń0#:Ō0#:ŉ0#:Ņ0R;F&\\\")7E;B#:ŕ0#:Ŕ0#:œ0#:Ś0#:ő0#:ś0R;F&:)7E\\x00\\x00	\\x00Ĥ 6\\r'(;B#:`)\\x00;B#:`)#:ŗ);G&);;G&);B#:@);G&9))#:Ŗ3;F&)=6\\r;B#:)6\\r;B#:);G&)))#:¹)(>;B#:);G&)))#:¹+\\x00(3;M#:)6\\r;M#:;B;Gġ));G&)));G&1)3(>\\\";G&))(>#:ŝ(>;B;G&|))(>\\\";G&)+(3;M;G&;);B;Gġ));G&)));G&1)\\\"g3\\\";G&)\\\"-3(>\\\"6\\r\\\";Gµ)\\\"3.\\x00:];G&8)13(>\\\"\\\"5;F&;)96;F&N)7H\\x00\\x00#?\\\"!>6;F&W)7H2;G&&)\\\"\\x00\\\"3\\x006\\r\\x00#:ř)(>(>&\\x00(>\\\"\\x00\\\";F&)96!\\\";G&)\\\";GÎ))3\\\";GÎ))(>>,8/<p(>\\\";G&C)136\\\";G&C)13$>#:Ő0#:Œ0#:Ş0(>\\\"\\x00;;G&)\\\"\\\"3;F&)\\x00\\x00\\x00.\\x00:^(>;;G&)\\\";G&L))<ܐ3(>\\\";G&C)13(>;;G&);Bcܕ<p#:Ř3;F&)\\x00;;G&)\\\"#:ş3;F&)=62;G&')2.\\x00:];G&8)13/32;G&&)\\\"\\x00\\\"3\\x00\\x00\\x00õ;B;G&))\\x00;B;G&));G&)))6Û;B;G&))(>\\\";G&)))(>\\\";G&*))(>;B;G&)+\\x00(3;B;G&));G&)\\\":R;B;G&));G&)));G&*)+(3;B;G&));G&)));G&*));G&*):R;M;L&i);B;G&))	ܗ'۸	۬\\\";O&)),ը	ܗ'۸	۬\\\";E&)),Ɵ	ܗ'۸	۬\\\";Hï)),җ	ܗ'۸	۬\\\";I&K)),ʗ/3\\x00%;F&+)7:\\\"c &6\\x00.\\x00.\\x00\\x00)2\\n&\\x00\\\"\\x00;L&<))\\x00d:S;F&+)7:2;G&&)\\\"\\x00\\\"3\\x00\\x00H;B;G&?));G&F))!:g(>\\\"7!:!:!:(>\\\"!:X(\\\"+6\\\"!<!:!:(>\\\"!:X(\\x00\\x00¿\\x00#:Ç:T6;#;G&)\\x00#:Ç;L&U)[3(> \\x00#:Î:T6;#;G&)\\x00#:Î;L&P)[3(>\\\"6 \\\"!:g(>\\\"\\x00\\n\\\"N;F&)J6;F&g)7E\\x00	;G&)6J;;G&)#:Ŝ3;F&)6;F&)7E;Fľ)7H;;G&)#:Ŭ3;G& ));F&<)J6;F&$)7E\\x00\\x00\\x00&\\x00(>\\n&(>;#:š6\\r;;F&4)6b;B#:@)(>\\\";G&9));G&:)#:Ů.:K-3(>\\r\\\"\\r6\\n\\\"\\r&)!:V&\\x00(>\\\";F&n)J6#\\\"#:)&6\\r\\\"#:ū)6\\r\\\";FÜ)J6#>#>\\x00C;B#:ũ.\\x003(>+\\x00;F&):S(>#:Ť(>\\\"\\\"#:Š)۱#:Ũۭ:+;G&U)+-3;L&g)+3\\x00\\n2;L&)n3\\x00\\x00*\\x00\\x00n;B#:Ţ23\\x00;G&))#:ť6#;B;GT))#:ŭ#:ţ-3(>&\\x00(>\\\"\\\";G& ))96,\\\"\\\")(>\\\";G&))26\\\"#:ů)&\\x006*>,89\\x00\\x00\\x00!?##	6\\n;Fþ)7H+\\x007\\x00\\x006;Fþ)7H\\x00\\x00Ŋ;D;G&%)#:m-3(>\\\";G&)\\x00;G&))(3\\\";G&$)\\x00;G&$))(3&\\x00(>&\\x00(>\\x00#:Í)62\\x00;G&));F&,);F&):c(>\\x00;G&$));F&,);F&):c(>\\\"#:h<܍-3(>\\\"#:p\\x00#:p)(3\\\"#:d#:Ï\\x00#:)<܏\\x00#:)<܏\\x00#:)<܏\\x00#:);G&q)(3\\\"#:\\x00#:)\\\"\\\"g3\\\"#:d#:Ï\\x00#:)<܏\\x00#:)<܏\\x00#:)<܏\\x00#:);G&q)(3\\\"#:&\\x00&\\x00\\x00;G&))\\x00;G&$))u3\\\"0\\\"#:&\\x00&\\x00\\x00;G&))\\x00;G&$))L3#:_)0\\x00\\x00ó\\x00#:&\\x00;F&):c(3\\x00#:&\\x00;F&):c(3\\x00#:&\\x00;F&):c(3\\x00#:p<(3\\x00#:Í(3\\x00;G&))265\\x00#:&(3\\x00#:#:Å(3\\x00#:#:ŧ(3\\x00;G&)(3\\x00;G&$)(3k\\x00#:#:a#:Ä&-3(3\\x00#:#:a#:Ä&-3(3\\x00#:;\\\\;G&3);F&W);F&|):c-3(3\\x00;G&)&\\x00;F&):c(3\\x00;G&$)&\\x00;F&):c(3\\x00\\x00\\x00;G& ));G& ))96\\n\\x00;G& ));G& ))(>&\\x00(>\\\"\\\"96_\\x00\\\")\\\")=\\x00\\\"&)\\\"&)=\\x00\\\";F&4))\\\";F&4))=\\x00\\\";F&())\\\";F&())=6&;F&<)$>8f&\\x00\\x00\\x00\\x00g;B#:Ì.\\x003(>;F&4)(>;F&4)(>(>\\\";G&)2\\n(3\\\"\\\"\\\"&d\\\"#:&(3\\\"!(>\\\";G&`)\\\"&\\x00)#:13(3\\\";G&)+\\x00(3\\x00ª;D;G&%)#:m-3(>\\\"#:h<܍-3(>\\\"\\x00\\\"\\x00\\\"#:È)6\\r\\\";G&)2;G&))(3\\\";G&$)2;G&$))(3\\\"#:È2&\\x00&\\x002;G&))2;G&$))m3\\\"#:&\\x00&\\x002;G&))2;G&$))L3(>2&)\\\"#:_)(>\\\"7H\\x00\\x00\\x00C(>\\\";G&)2\\n(3\\\";F&);F&)&\\x00d\\\"!&)(>\\\"\\\";G&);F&<)-3\\x00\\x00Q(>\\\";G&)2(3\\\";F&);F&)&d\\\"!&)(>\\\";G&$);F&4)$3\\\"!&)(>\\\"\\\"\\x00\\x00\\x00\\x00e;B#:Ū)(>\\\"6\\\";G&)))#:>6;F&z)7E;B#:Ŧ)(>\\\"62\\\";G&)))#:Ŷ>6;F&_)7E\\\";G&)))#:>6;F&)7E6?111\\x00);G&)13(>\\\";G&)-3&\\x00\\x00\\\";G&);G&B)-3&\\x00\\x00\\x00\\x00;F&E)7E\\x00\\x00«;F&D)(>;Fð)(>;Fð)(>(>&\\x00(>\\\"\\\"96\\\";G&);j;G&x)133\\\"\\\")$>>,8&\\\"\\\"s(>;j;G&g)\\\";F&.)F-3(=&\\x00(>\\\"\\\";G& ))96\\\"\\\")\\\"5;F&4):&$>>,8%\\\"\\\"s(>;j;G&g)\\\";F&.)F-3(>\\x00\\x00@?2;;.\\x00:](>&\\x00(>.\\x00:]\\\"5;F&()96>,\\\";Fƍ)68 \\\"(?;F&%)(?\\x00\\x00;o(>;J&K)!>(>\\\"6;F&H)7E\\x00\\x00\\x00(;P+\\x00;G&T));P;G&))+;G&))6;F&[)7E\\x00\\x00\\x00\\x00\\x00\\x00\\x00$;B#:ų\\n6;F&:)7H;B#:ż\\r6;F&)7H\\x00\\x00\\r\\x00Ã;6;D#:Ž);D#:Ÿ)6&7H\\r#:ª(>#:ű(>#:ŷ(>#:ŵ0#:Ų0\\\"0(>;B#:ž)(>;B#:Ŵ)(>;B#:ź)(>	#:Ź(>\\n#:Ż(>\\\"\\x00\\n;B;C&J))\\x00#>;G&);E&|)-3&\\x006;F&J)7H\\\"\\x00\\\";G&@)\\\"\\n-3\\\"	\\x00\\\"	;G&@)\\\"-36;F&R)7H?*>\\r\\x00Ĵ;B2\\n6;F&4)7H;D2\\n6;F&()7H;B#:Ű)(>\\\"\\x00\\\"2)6;F&<)7H;B#:@)(>\\\"2)6;F&)7H\\\";G&9))(>\\\";G&:)#:Â.:K-3(>\\\"\\x00\\\"&)!:V;F&L)96#\\x002\\\"%(>#\\x00\\\"2)(>\\\"6;F&)7H#:ſ<ۻ.:K(>;D>	K/\\\"	&\\x00);JĨ)\\x00\\\";G&)\\\"	-3\\x00;D\\\"	);N&O))6;F&)7H&\\x00(>\\n\\\"\\n2;G& ))96$;D;G&2));G&)2\\\"\\n)-36;F&/)7H>\\n,82*>\\rĲ;;Fĸ)6	;M#:2236;F&?)7H;M#:2;C&9))23(>\\\"6R;G&,)\\\"%6;F&)7H#:Ƌ.:K(>\\\";G&));G&)\\x00\\\";G&)\\\";G&));G&)13-36;F&)7H 2;G&:)#:ƀ-362;G&:)#:Â.:K-3(>\\\"\\x00\\\"&)!:V;F&L)J6;F&=)7H2;G&:)#:Ɓ.:K-3(>\\\"\\x00\\\"&)!:V;F&&)J6;F&0)7H2;G&:)#:ƈ.:K-3(>\\\"\\x00\\\"&)!:V;F&=)J6;F&))7H	\\x00\\x00\\x00\\x00\\x00+\\x00(>#:ƅ\\\"%\\x00\\x00\\x00\\x00\\x00Y2B6'+\\x00#U(>\\\"6G\\\"#:Ë)(>\\\";G&)63(>\\\"7>;G&L)\\\"%(>#(>\\\"\\x00\\\"6;F&])7E'(B'\\x00?;^\\x00\\x00<;D;G&E)#:Ƃ-36;F3)7H#:Ǝ(>#:Ə(>;B\\\"\\n;D\\\"\\n6;F&j)7H\\x00\\x00#\\x00;B#:Æ)6S;B;G&))6	;B;G&));G&)13(>;;G&)\\\"#:ƍ3;F&)=\\x00;;G&)\\\"#:Ƅ3;F&)=6;F&\\r)7H;B#:ƌ)\\x00;B#:Ɔ)\\x00;B;G&6))<p;G&)#:Æ-3;F&)=6;F&S)7H	\\x00\\x006;B#:Ƈ\\n6;F&)7H;B#:ƃ\\n6;F&,)7H;B#:Ɗ\\n6;F&C)7H\\x00\\x0022@6'#:Ɖ<ۻ.:K(>;B\\\";F&	)A(@2@6\\n;F&)7H'\\x00\\x00?2@6\\r\\x00\\x002A	6.;B#:½)(>;x;G&d))\\x00;x;G&d)\\\"-36&(@;F&+)7H\\x00\\x00#:ƛ!:P#U(>\\\"6;FÃ)7H\\x00\\x00³?¦®®	(>#:Ƙ!:P#U(>\\\"6;F&P)7H;B;G&-)=\\x00\\n;B#:Ɛ)#:ƙ6;FÌ)7H;D;G&-)=\\x00\\r;D#:);G&)6*;D#:#:É3(>\\\"\\x00\\\"#:ƒ)#:Ɯ\\\"%6;Fă)7H;B#:À)\\x00#:Ã!:K;G&);B#:À)<p-36;F)7H;F&e)7E\\x00\\x00w#:Ƒ(>;;G&)\\\";G&)3(>&\\x00(>&\\x00(>\\\"\\\";G& ))96;B\\\"\\\"));G&)6>,>,8&;B#:@)(>\\\"\\\";G& ))\\x00\\\"\\x00\\n\\\"#:Á)#:Ɣ6;F&r)7H\\x00\\x00 ?;B#:ƞ)6	;B#:ƕ)\\x00;B#:Ɠ)6	;;G&);B#:)<p;G&B)3;F&)\\x00\\r;B#:Ê);G&)\\x00;B#:Ê)#:Ɵ)#:ƚ6;F&f)7H;B#:)\\x00;B#:);G&)))\\x00;B#:);G&)));G&T))<p#:Ɨ6;FË)7H\\x00\\x00>;B#:×);G&)\\x00\\n#:Ɩ;B#:×)%\\x00\\r;B#:Ò);G&)\\x00\\n#:Ɲ;B#:Ò)%6;Fĉ)7H\\x00\\x00(;B#:¨)\\x00\\n#:ƭ;B#:¨)%\\x00\\n#:Ʃ;B#:¨)%6;F&y)7H\\x00\\x00¥;B;G&?))\\x00;B;G&?));G&))\\x00;i;G&))<p;G&)#:f-3;F&)=6;F)7H;B;G&6))<p;G&)#:f-3;F&)=6;F&L)7H;B;G&6));G&)))\\x00';B;G&6));G&)));G&T))<p;G&)#:f-3;F&)=6;F&B)7H\\x00\\x00%;B;G&6))<p;G&)#:ƪ-3;F&)=6;F&G)7H\\x00\\x00N;B#:ƥ);G&)\\r;B#:Ʀ);G&)6;F&`)7H#:ơ<ۻ.:K(>;B;G&?))\\\";F&=)A6;F&)7H\\x00\\x00\\x00÷?òòò\\r;D;G&%)#:m-3(>\\\"#:h<܍-3(>\\\"#:p<(3\\\"#:ƨ<p-3;G&))&\\x00(>\\\"#:d<ۮ(3\\\"#:&\\x00&\\x00&&u3\\\"#:&\\x00&\\x00&&L3(>#:Ơ\\\"!>(>#:Ʈ(>;;G&)\\\";G&)3(>	&\\x00(>\\n&\\x00(>\\\"\\\"	;G& ))966\\\"\\x00\\\"	\\\"))(>\\\"\\x00\\\"	\\\")&\\x00(3\\\"\\x00\\\"	\\\"))&\\x006\\\"\\x00\\\"	\\\")\\\"(3>\\n,>,8C\\\"\\x00\\\"\\x00\\\"\\n\\\"	;G& ))6;FÈ)7H_<p(>&\\x00(>\\\"\\x00#:_);G& ))96A\\x00#:_)\\\")&\\x006\\n;G )(>\\x00#:_)\\\");F&)6#:ƫ(>#:Ƭ(>\\\"$>>,8R\\\"\\x00\\x00\\x00\\x00Ȓ?ȍȍȍ;P;G&)));P;G&)));G&&))(4p;P;G&)));G&&)+\\x00(3;D;G&%);G&h)3\\\"<pe;P;G&)));G&&);P;G&)))p(3;P;G&)))4ph\\\"<p(>;;G&)\\\"#:ƣ3;F&);;G&)\\\"#:Ư3;F&)6;F÷)7H;M;G&H))6|;B#:Û)6t;M;G&H);B#:Û);G&)))-3(>\\\"6X\\\"#:z);G&))<p(>\\\"#:Ƨ);G&))<p(>;;G&)\\\"#:Ƣ3;F&)=;;G&)\\\"#:Ƥ3;F&)=6;F)7H(>;P;G&)));G&&))(>;G&;);M%(>	;M;G&;))(>\\n?[[[;P;G&)));G&&)+(3\\\";G&);D;G&%);G&h)-33;P;G&)));G&&)\\\"(3;M;G&;)+(3\\\";G&);D;G&%)#:£-33;P;G&)));G&&)\\\"(3\\\"	6\\r;M;G&;)\\\"\\n(3	;M;G&;)3h\\\"\\x00\\\";G& ));F&()\\x00\\\"&\\x00);G&-)\\x00	\\\"&)#:Ƴ6;Fĺ)7H\\x00\\x00\\x00,?\\\"c܌(>\\\"6\\\";GÎ))(\\\"\\x00\\\"&\\x00)\\\"&)4p\\x00\\x00\\x00\\x00\\x002;G&)3\\x00\\x00ƽ;6\\r'(>?;D#:©);A\\x00;D#:©);G& ))(>	(>;;G&);D;L&3)3(>\\\"#:Ö(\\nۿ\\\";G)#:ƾ(3;D;G&5))\\x00;Bé66;;G&);D;G&5))\\\"/3;B#:Ö);G&-)(>;0;G&);D;G&5))\\\"/3	(>;;G&);D;G&J)3(>\\\"#:ƿ(\\nۿ\\\";E&4);G)(3\\\";G&);G)(3;;G&);D;G&J)3(>\\\";G&)#:e(3\\\"#:Ʒ(\\nۿ;;G&);D;G&J)3(>	\\\"	;Gÿ)(\\nۿ\\\"	;G&);L&()(3\\\"	;G&)<ۿ(3	(>\\n?'++;;G&)\\\"\\\"/3;;G&)\\\"\\\"/3;;G&)\\\"\\\"	/3'(>\\n\\\";G))\\\"=(>\\\"	\\\"#:e)\\\"=(>\\\"\\\"cۿ\\\"	=(>\\\"\\\";Gÿ))\\\"	=(>\\\"\\\"\\\"\\\"\\n6;Fç)7H\\x00\\x00i&\\x00(>;N&#).:^(>;;G&);H&\\\");G&)3(>&\\x00(>\\\"\\\";G& ))96\\\"\\\"\\\"));A6&\\\"fE>>,8'#:Ë;^%6&;F&)fE>\\\"\\x00\\x00ć;B#:@)(>\\\"#:s)(>#:u(>#:®(>\\\";G&9))6\\\";G&9))!:X(7\\\"6\\\"(8;B;L&\\\"));G&)13;G& ))(9\\\"\\\"%6\\\"\\\")(;\\\"\\\"%6\\\"\\\")(;;F&f)7E#'(: ;A6N	(	(	(;B;G3))68'(;B;G3);Iē)-3;Gç))6'(;B;G3);O&m)-3;Gç))6'( 6 ;Fĉ)7E 6;F&y)7E 6;F)7E\\x00\\x00	к;B#:@)(>\\\";G&9))(>;B#:¦)(>\\\"\\x00\\\"#:Ü)6;F&()7I;F&)7EÇ\\\"#:Ù);A6¼&(:;F&?)7E&7E;F&)7E;B#:ƽ\\n6\\n;F&)7I;;G&)\\\";L&&)3;F&)=6\\n;F&5)7Ik;B#:Ƶ\\n6\\n;F&4)7IW;B#:Ƹ\\n6\\n;F&)7IC;B#:Ʊ\\n6&7I2;B#:ƺ\\n;';G&)\\\"#:Ƽ3;F&)=6\\n;F&$)7I;F&()7I\\r;B#:ƶ);A\\x00	;B#:Ʋ);A6%&(;F&<)7E;F&<)7I;B;Gú))6&(>;B;Gé));A6\\r;F&?)7E&(:#G6;FË)7E;(>\\\";F&)J6<\\\"7I&\\x007E\\\";F&)J6\\\";B;Gú))\\x00;B;L&A));B#:Ð)6&(> 6\\r\\\"#:ƴ)6Ű;F&)7E;B#:ƹ\\n6\\n;F&+)7I¦;;G&)\\\"#:ư3;F&)6\\n;F&:)7I;;G&)\\\"#:ƻ3;F&)6\\n;F&<)7If;B#:¥)\\x00\\r;B#:¥);G&)\\x00\\n#:ǎ;B#:¥)%;';G&)\\\"#:ǋ3;F&)=6\\n;F»)7H#;B#:ǌ	;B#:ǆ6\\n;F&_)7I&7I;B#:`)\\x00;B#:`)#:Þ)6;B#:`)#:ǈ)6;B#:ß);A\\x00;B;G&e))#:ß);A\\x00;B#:Ǐ)\\x00;B#:Ǎ)6\\n;F&)7IR;B#:Ú)\\x00;B#:Ǆ)6?;B;G&j))#:Ǌ)\\x00;B#:ǀ)6&;B;G&j))#:ǅ)\\x00;B;G&j))#:ǁ)6;F&)7H;D;G&2));G&))#:Ǉ\\n6;F&4)7I;F&)7E;B#:ǉ\\n6\\n;F&)7I;B#:ǂ\\n6\\n;F&)7It;B#:ǃ\\n6\\n;F&\\\")7I`;;G&)\\\";L&&)3;F&)=6\\n;F&5)7I>;B#:`)\\x00;B#:`)#:Ǔ\\n6\\n;F&z)7I;B#:Ñ)\\x00;B#:Ñ)#:Ǖ\\n6;F&)7I\\\"#:)\\x00\\n\\\"#:)#:Ô)6;F&)7I;F&()7E;B#:ǒ)(>\\\";G&)6#:ǖ(>\\\"#:ǟ\\\"-36;FČ)7E\\x00\\x00Ƈ;B#:@)(>\\\";G&9))(>;B#:ǚ\\n6;F&\\\")7H;B#:ǔ\\n6;F&$)7H;B#:ǐ\\n6;F&)7H;B#:Ǟ	6;F&5)7H;B#:Ǘ\\n6;B#:Ø)6;F&>)7H;B#:Ú)\\x00;B#:ǜ)6;F&z)7H; 6**%**#;B#:Ǚ);B#:ǘ)6;F&_)7H#:Ǜ!:K;G&)\\\"-3	\\\"#:z);16;F&)7H#:ǝ!:K;G&)\\\"-36;F§)7H;B#:Ǒ)\\x00;B#:Ǣ)\\x00;B#:Ǫ)6;F&e)7H;B#:ǩ);A6;F&g)7H#:ǣ;B%6;F&O)7H; 6<*1*/********\\\"**!*0*4*\\x00\\x00\\x00?*)**;F&a)7E+\\x0072\\x00\\x006;F&Y)7E\\x00\\x00\\r\\x007H;F&)7:\\x00\\x00	Ʉ2F6,#:ǯ.:K(F#:Ǩ.:K(G#:ǭ.:K(H#:Ǧ.:K(I&(>&\\x00(>\\\"\\x00;G& ))96ǻ\\x00\\\")(>;E&o)\\\";G&))6¥\\\";G&D));G&s))\\\";G&D));G&s));G&f))6ƴ\\\";G&D));G&s));G&f)13;G&5)\\x00\\\";E&-))#:ǫ6;FĮ)7,\\rB\\\";E&-))#:Ã\\x00\\\";G&D));E&S))\\x002F;G&)\\\";G&D));E&S))-36\\n;F&)7,\\rĹ;E&R)\\\";G&))6ĩ&\\x00(>\\\"\\\";E&i));G& ))96đ\\\";E&i))\\\")(>\\\"\\\";I&V))6ñ\\\";G&s))\\\";G&s));G&f))6Ó\\\";G&s));G&f)13(>\\\";G&{)6.\\\";G&);G&)-3(>\\\"\\x002G;G&)\\\"-36	;F&\\n)7,\\\";G×)6n;D;G&2));G&)#:ǡ-3;G )6	;F&^)7,\\\"#:e)\\x00\\\"#:e);G& ));F&)96-2H;G&)\\\"#:e)-32I;G&)\\\"#:e)-36	;F&)7,\\\"#:Ǯ6	;F&X)7,>,8Ĥ>,8Ȉ\\x00\\x00Z;B;LÃ))(>\\\"6I2-.>(>(>\\\";E&o)'(3\\\";E&R)'(3\\\";N&k)'(3\\\";G);D;G&2));D;G&5))\\\"/3\\x00\\x00;B#:Ǭ)(>\\\"\\x00\\\"#:Ǡ\\n(>\\\"6;F&[)7H;B;G&6));G&)\\x00;;G&&);B;G&6))-3<p(>\\\"\\x00;;G&)\\\"#:ǥ3&(>\\\"6;F&i)7H\\\"\\x00;;G&)\\\"#:ǧ3;F&)(>\\\"6;F&9)7H\\x00\\x00ƅ;B#:Ó);A=\\x00	;B#:Ý);A=\\x00	;B#:Õ);A=\\x00;B;G¦))\\x00;B;G¦));G&)13;G&)#:Ǥ-3&(>\\\"6;F&h)7H?KKK;B;G&6));G&)\\x00;;G&&);B;G&6))-3<p(>;;G&)\\\"#:ǲ3;F&)(>\\\"6;F&k)7H;B#:í)6;B#:í)#:Ǻ)<p<p(>;Bc۴;G&)\\x00;Bc۴;x;G&)))c۴(>\\\"#:ǰ(>\\\"\\x00\\\"6;F&})7H;B#:)\\x00;;G&);B#:)#:ǿ)<p#:Ǵ3;F&)=(>	\\\"\\x00\\\"	6;F&E)7H;;G&)\\\"#:Ǹ3;F&)(>\\n\\\"\\n6;F&Y)7H;;G&);x;G&)))c۴<p#:Ǿ3;F&)(>\\\"6;F&w)7H\\x00\\x00C?<<<#66#:Ƕ!:P#U(>#:ǳ!:P#U(>#:Ǽ!:P#U(>\\\"\\x00\\\"\\x00\\\"6;F&H)7H	\\x00\\x00\\x00ĕ+\\x00(>+(>?ăĆĆ;B#:@)(>;B#:ã)\\x00\\\"#:â)\\x00#:ǻ!:K;G&)\\\"#:â)-36;B#:ã;B#:ǹ)&\\\"\\\"u3¿#:ǵ;D;G&2));G&))%6/;B;Gú));G&6);G&m)-3(>\\\";G&N)\\\"(3\\\";Gİ)\\\"(3|;B#:¦)\\x00\\n;B#:¦)#:Ü)6C?9<<;B;G&|));G& ))6*>$;B;G&|))&(\\nò;B;G&|));Gµ);L&.)3*>*>%;B;Gú))\\x00;B;L&A));B#:Ð)6*>*>*>\\x00'7H\\x00\\x00\\x00	7H\\x00\\x00\\x00\\x00,;;F¾)6\\\";B#:Ì.\\x003(>\\\";G&)+\\x00(3\\\";G&`)#:Ƿ(3\\x00;F&&)7H;F&4)7:\\x00\\x00x;B>Kp?kkk;B\\\");G&)\\x00;B\\\");G& ));F&4)\\x00;B\\\");G&))\\x00;B\\\");G&));G& ));F&)6$;;G&);B\\\")<p#:ǽ3;F&)6;F&&)7H	\\x00\\x00Ŷ?#:Ǳ7:o;F&P)7E?#:Ȅ7:o;FÌ)7E?#:Ȉ7:o;Fă)7E?#:ȁ7:o;F)7E#:Ó;B%R;F&`)7E#:Ý;B%R;F&)7E#:Õ;B%R;FĮ)7E;G¦);B%R;F&^)7E;G&6);B%R;F&)7E;8R;FÃ)7E;R;F§)7E;nR;Fç)7E;wR;F÷)7E;+R;F)7E;kR;Fĺ)7E;(R;F&r)7E;B#:ê)R;F&-)7E;B#:è)R;F&&)7E;B#:î)R;F&\\r)7E;B#:Ø)R;F&S)7E;B#:@)#:Ù)R;F&w)7E;B;Gé))R;F&\\n)7E;B#:`)\\x00\\n;B#:`)#:Þ)R;F&A)7E\\x00\\x00;B>KI?@DD;B\\\");G&)62;B\\\")<p(>;;G&)\\\";G&B)3;F&)6C,	2E\\\"\\\"(3D,;G&6)2E%R;F&)7E;B;L&))R;F&,)7E;B;L&6))R;F&C)7E\\x00\\x00\\x00\\x00;;F)6	  6	\\x00\\x00	\\x00;G&)6`?\\x00!:Ȍ(\\x00\\x00;G& ));FĤ)6\\x00;G&G)&\\x00;FĤ)3(\\x00\\x00!>\\x00!>6\\\";F&)7:;F&);I&R)%;;F&4)6'	M&\\x00(>\\\" ;G& ))969 \\\");E&N));L&O)\\x00-3(>\\\"6&( \\\")cۿ(\\\"&\\x00)( '>,8F	\\x00\\x00P&\\x00(>\\\" ;G& ))96< \\\");E&N));L&O)\\x00-3(>\\\"6;F&4)( \\\")cۿ(\\\"&\\x00)( '>,8I	\\x00\\x00\\x00\\x00\\x00;F&)^&P&\\x00!\\\"_\\\"S4]\\r\\x00\\x00\\x00	Ɓ&\\x00(>&\\x00(>#?(>\\x00&\\x004T\\x00;4T\\x00#)48\\x00 ~48\\x00\\\"4;F&)!:Q(>\\\"&\\x00\\x00\\\";F&/)96&E>\\x00\\\"4T(>\\\";B;G&?));GĨ))(4x\\\";B;G&?));G&u))(4n\\\";B;G&?));L&1))(4Y\\\"Y6.\\\"n;G&S)6\\\";G¢)(4Y\\\"n;G&=)6\\n\\\";G)(4Y\\\";B;G&?));G&Q))(47;F&()!:Q(>;;F&c)\\x00\\\"!:ȅ\\x00\\\"6;F&4)E>\\x00\\\"x;G&G)&\\x00;F&)34 6;F&<)E>\\x00 4C;;FƗ)6;F&/)E>\\x00#:à!O4V;F&k)!:Q(>\\\"&\\x006;F&)E>\\x00\\\"\\\":ä\\x00\\\"\\\"/4T\\x00\\x00\\x00\\x00° ¢6\\r'(¢\\\"&\\x00:S;^\\x00.\\x00:^(>\\\"6\\\";G&L))(>\\\"6\\r\\\";G&)13(>;;G&)\\\"<ܐ3(>\\\";G&C)13(>\\\"<p\\x00\\\";G& ))&\\x006\\\";G&C)13(>;;G&)\\\";H&H)3;F&)\\n\\\";I&3):T\\\";E&)6\\n;F&h)7E'	(¢\\x00\\x00\\x00N#:a;F&\\x00)F!:(>\\x00;G&)#:v!:Ȃ-3(\\x00&\\x00(>\\\"\\x00;G& ))96\\r\\x00\\\"\\\"G3>,8*M\\x00\\\"\\\"(3\\x00\\x00\\x00\\nČ\\x00;G&)&\\x00-3(>\\\";G& ));F&)96\\r\\\";G&C)13(>&\\x00(>\\\";G& ))(>\\\"\\\"96\\\">^\\\"G38\\\";G& ));F&<)5(>#:v\\\";G&)\\\"-3!:Ȏ&\\x00)5(>\\\" £6\\\"(£\\\";G&)&\\x00\\\"3(>\\\";FƄ)6\\\";D#:ȋ);G&)6\\\";B#:ȏ#:ȃ-3(>\\\"\\\"s#:Ȇ!:\\n!:?!:\\n(>	\\\";G& ))(>&\\x00(>\\\"\\\"96\\\"\\\"\\\"	\\\">^)P(38\\\"	&\\x006;F&	)7E\\\"\\x00\\x00\\x000&\\x00(>#:Ȋ(>*>\\x00;F&)^&P&\\x00!\\\"_\\\"H\\\"S4]\\r_&;F&)!:Q6&(¥;%;G&)\\x00\\r;\\x00;;F&/)o6;B;Gs);Ȁ(3;B;Gs));Gs):R****\\r**\\x00\\x00***\\x00\\x00¡26;F&M)!:[(>;F&K)!:[(>;;\\\");G&)13!:X(>&\\x00(>;P;G&)));G&));G&&)#:ȉ-3(>\\\";G& ));F&.)s!:V(>\\\";G&G)\\\"\\\"F\\\"3!:X(>\\\"\\\"D;F&b)(*M\\x00 £48\\x00249\\x00249\\x00\\x00G;F3)!:Q!:(><۽#>;G&);F&)-3(>\\\";B%6;B\\\";A(3?;B\\\"3h;F&M)7E\\x00\\x008;cܖ(>;;;F&)\\x00\\\"&);FÛ)\\\"&);FƉ)6;F&9)7E\\x00\\x00#:b;G&F));N·):T6\\n;i(:B;D(:i\\x00\\x00;B;L&\\\")#:ȇ-3(>\\\"6;F&O)7E\\x00\\x00N\\x00\\x00\\\".\\x00:](>*	.\\x00:]\\\"5;F&.)6;F&O)7E\\x00\\x00\\x008.\\x00:](>\\\"(>\\\"(>&\\x00(>?&\\x007>.\\x00:]\\\"5;F&)6;F&O)7E\\rF*.\\x00:](225;F&.)(2(26\\r;F&O)7E&\\x00(\\x00\\x00;F&)96\\x00O7\\x00\\x00\\x00#:ȍ;B%;L&6);B%6;F&J)7E\\x00\\x009&;F&)!:Q6,2;F¶):l2\\n;Fſ):l2;F):l2;Fƅ):l\\x00\\x00z&;F&)!:Q6m;G)0;L&*)0;L&b)0;G&X)0;Gï)0;L&)0;G¾)0;G&l)0;G&J)0;L&t)0(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")2\\n&\\\"\\\")2&>,8(\\x00\\x00\\x00# ;G& ))&\\x00\\x00;6\\r&0&\\x000&\\x000(>*>\\rH;J).:K(>2;G&)13(>\\\";G&)\\\"-3(>\\\"62&3W(>\\n2&\\x003W(>\\\"!\\x00\\x00\\x00;:6#\\x00\\x00\\x00i&\\x00(>2;G& ))(>\\\"\\\"96Q#:a;F&)F(>\\\"!:(>2\\\")(>2;G&)\\\"32;G& ))(>2;G& ));FƓ)627:Ȑ>,8X\\x00\\x00\\x00;;F&?)96\\r?xxx;D;Gñ);G×)-3(>#:ȑ(>\\\"\\x00\\\";G& ))&\\x006P\\\"&\\x00);Gÿ))6\\\"&\\x00);Gÿ))\\\":T6;F3)7E&;;G&)\\\"&\\x00);G&`)) s3;F&)6;F3)7E\\x00\\x00&;F&m)!:Q62;FƋ):l\\x00\\x00\\x00v+\\x00(202020;0(>;%;G&)\\x00\\r;\\x00;;F&/)o6\\\";G&);B;Gs))3(>&\\x00(>\\\"\\\";G& ))96\\\"\\\")(>\\\"\\\"\\\"!!:X(3>Y8)\\x00B?===&\\x00(>\\\"2;G& ))96*2\\\")(>\\\"!!:X(>2\\\")\\\"6'(>Y88\\x00\\x00\\x00+\\x00(¤\\x00\\x00(26##:!(2	+\\x00&\\x00:S(\\x00\\n;A@(\\x00\\x00q&;F&m)!:Q6d;o;B;L&\\\"));P;B;E&p));P;G&)));G&T));B;E&p));G&)));G&T))*26;;A;;F&/)62&\\x00:S\\x00\\x00\\n;D(:B;i(:D\\x00\\x00?XX;4;G&)\\x003\\\";Gþ));G&)\\x00;;G&)\\\";Gþ));Lõ)3;F&)6;;G&)\\\";Gþ));Lõ)3;G&C)13?;;G&&)\\x00-3\\x00\\x00\\x00;G&))6\\x00<p<p\\x00\\x00D????\\x00!(>#:ȗ.:K(>\\x00;G&)\\\";G&)\\\"-3;A=\\x00\\x006'(\\x00\\x00\\x00&;F&m)!:Q6+\\x00\\x00$#:\\x005(>\\\";F&I)62&\\x00:S#:!\\x00\\x00\\x00	\\x00+(><p(>\\x00;F&)^&P&\\x00!\\\"_\\\"H\\\"S4]\\r\\x00\\x00\\x00**\\x00\\x002;G& ))&\\x006\\x0024\\x00\\x00};F&O)!:[<p(>\\\";G& ))&\\x006\\r?[[[\\\";G&);G&)-3(>&\\x00(>\\\"\\\";G& ))968\\\"\\\");G&);G&w)-3(>\\\";G& ));F&4)62\\\"&\\x00)\\\"&)(3>,8E\\x00\\x00Y(>2>K#2\\\")!B(>\\\";G&);G&[)\\\"<۩\\\"3\\\";G& ))&\\x006;E&t)\\\";G&();G&)-3;GÉ)(\\x00\\x00\\x00\\x00]	(>\\r<p(>(><ܑ(><ܑ(><ܑ(><ܑ(><ܑ(><ܑ(>;F&9)!(>&\\x00(>\\x00;F&)^&P&\\x00!\\\"_\\\"H\\\"S4]\\r;;;Fƀ)6'(\\r;6*\\x00\\x002\\r6\\r*\\n*	***\\x00\\x009;\\x00 6\\r2\\r6\\r**2n4\\x00214%4V\\x0024T\\x0024C\\x00\\x00	ʁ	(>;B;G&-)6ɡ;B;G&?))\\x00;B;G&?));G&))\\x00;i;G&))<p;G&)#:f-3;F&)=6'(>Ȥ;B;G&6))<p;G&)#:f-3;F&)=6'(>ȁ;B;G&6));G&)))\\x00';B;G&6));G&)));G&T))<p;G&)#:f-3;F&)=6'(>ǂ	(>#:ț!:P#U(>\\\"6'(>Ʃ;D;G&-)=\\x00\\r;D#:);G&)6`;D#:#:É3(>\\\"6N#:Ȝ\\\"%6'(>ů?55\\\";E&);D;G&2));G&4)/3\\\";G&)13;G&)#:Ȓ-3;F&)=6'(>\\\"6į;B#:ï)\\x00;B#:ï)<p;GĪ)13#:ì6'(>ċ;B#:æ)\\x00;B#:æ)<p;GĪ)13#:ì6'(>ç;B#:ë)6&;B#:ë;D;G&2))-3(>\\\"\\x00\\\"#:ç)6'(>¹?;B#:.\\x003(>\\\"\\x00#:ç\\\"%6'(>\\\"6?<<<\\\"\\x00;G&T));G&T)#:ș-3#U(>\\\"#:§)\\x00\\\"#:§)\\x00\\r\\\"#:§);G&)6'(>\\\"6L;M#:é)6>;M#:é;B-3(>&\\x00(>\\\"\\\";G& ))96 \\\"\\\")!:\\\\;GĪ)13#:Ȕ6'(>>,8-&\\x0068ɮ\\\"62;F&i)4/\\x00\\x00C\\x00<ܑ62;G&)<p-3(\\r\\x00<p62;G&)<۾-3(\\r2;G&)\\x00<p-3(\\x00\\x00r<p((272727272727;	;G&)2;G&)3(2;G& ));F&\\x00)J6;\\r;G&)2&\\x00;F&\\x00)[3(\\x00\\x00;B;L&))\\x00;B;L&6))62;F&)4/\\x00\\x00\\x00×;D;G&%);G&{)-3(>\\\";G&))#:Ȗ#:Ȟ(3;D;G&5));G&\\r)\\\"3\\\";G&))(>\\\";G&)+\\x00(3;B;LÃ))(>\\\"6~\\\".>(>\\\";G)\\\"'Ƿ'۲'ǚ'ڋ'܈/3\\\";G&l)\\\":Z\\\";L&)\\\":Z\\\";G)\\\":Z\\\";L&*)\\\":Z\\\"#:Ț\\\":Z\\\"#:ȓ\\\":Z\\\";G&X)\\\":Z\\\"#:Ș\\\":Z2;F&\\x00)96,\\x00\\x00#&\\x00(>\\\"\\x00;G& ))96\\x00\\\")(>*>,8\\x00\\x00*2;G&)\\\"\\x00\\x003\\x00\\x00ċ.\\x00:](>;B;G&^))(>\\\"\\\";GĚ))<\\r\\\"#: )#: \\r\\\"#:¬)#:¬\\\";G&8));G&8)62;F&)4/\\r(>&\\x00(>\\\";F&;)96\\\"\\\"<p\\\"(3>,8(>&\\x00(>\\\";F&)96\\\";G&)\\\"3>,8#:Y(>\\\"#: \\\"3#:Y\\\"5(>#:Y(>	\\\";GĚ)\\\"3#:Y\\\"	5(>\\n\\\"#:¬n3\\\"\\n&6\\\"\\n&(>\\\"\\\";F&)F62;F&<)4/\\x00\\x00\\x00s#:ȝ(>?`hh;B#:ê)(>;B#:è)(>;B#:î)(>;B#:@)(>;B#:ȕ)(>;B#:)(>\\\"0#:ȟ.>(>	\\\"#:ȭ\\\"	-3.>(>\\n\\\"\\n#:ȣ+\\x00(32&4/\\x00\\rǩ?ǜǤǤ\\x00\\x00#:_)\\x00#:_);G& ));F&4)=\\n\\x00#:_)&)62;F&4)4/\\r\\x00#:_)&\\x00)(>\\x00#:_)&)(>\\\"Bų\\\"(>2;G&9))\\\"c܁=62;F&>)4/2#:)\\\"c۷=62;F&)4/2#:s)\\\"c۟=62;F&z)4/2#:z)<p;k;G&\\n)\\\"#:Ȩ)-3<p=62;F&_)4/\\\"c۟(\\\"#:ȥ)(ã;G&0)(>26j&&.(>\\\"#:h)6V\\\"#:h#:å-3(>\\\"\\x00\\\"#:¤)\\x00\\\"#:)65\\\"#:¤#:ȯ-3(>\\\"6$\\\"#:\\\"#:Ȣ)-3;G&)\\\"#:\\\"#:Ȥ)-3(>\\\"\\\"=62;F&)4/X;G&0)(>	2\\x002#:¢)6.2#:¢13(>\\n\\\"\\n\\x00\\\"\\n#:­)6\\\"\\n#:­13(>\\\"6	\\\"#:¡)(>	\\\"	\\\"=62;F&H)4/\\x00\\\";F&4)J62\\n#:ȩn32&4/\\x00\\x00\\x00ñ;D;G&%)#:£-3(>\\\";G&))#:á#:ó(3\\\";G&));G&);G&4)(3\\\";G&));G&$);G&4)(3\\\";G&));L&);G&)(3\\\";G&));E&g);L&d)(3\\\";G&));GĊ)#:Ȧ(3\\\";G&`)#:Ƞ(3\\\"<p;j;G&x)13;G&);F&)-3;Gö);F&4)-3(\\nۿ;D#:Ȯ);D;G&5));D;G&2));G&\\r)\\\"3\\\"#:ȧ)(>+\\x00(>\\\";F&.):S2;G&b))62;G&b));G&t)23\\x00\\x00?2#:ȡ\\x00#:Ȫ/324/\\x00\\x00\\x00{2\\x002#:ñ)62#:ñ.\\x003.\\x00:^(>;M;G&;)\\\";G&L)	ܗ	۸+\\x00g32\\x00	2;G&^))\\x00\\r2;G&^))#:«)62;G&^))#:«\\\"3;B;G&^))#:«\\\"3\\x002;F&()4/<p\\x00\\x00ȕ?ȄȌȌ262;F&)4/#2;B62;F&?)4/2#:ð);B#:ð)62;F&)4/2#:@)(>;B#:@)(>\\\"62;F&/)4/#\\\"#:s)\\\"#:s)=62;F&)4/\\\";G&9))\\\";G&9))=62;F&=)4/\\\"#:)\\\"#:)=62;F&0)4/\\\"#:z)<p\\\"#:z)<p=62;F&))4/\\\"#:u)\\\"#:u)=62;F&)4/\\\"#:ª)62;F&)4/#:ÿ<ۻ.:K(>2\\\";F&	)A62;F&+)4/#:ÿ<ۻ.:K(>2;G&e))\\\";F&	)A62;F&\\\")4/\\\"#:¯);F&:)\\\"#:¯)&\\x00);F&)\\\"#:);F&$)\\\"#:)&\\x00);F&5)272;GÃ))(2;Gā))(\\\"#:s)(\\\"#:þ)6\\\"#:þ)#:ȫ);G&0)(2;D#:©2cۿ-362;F&[)4/2&\\x004/*\\x00\\x00\\x00\\x00\\x00&\\x00^&P&\\x00!\\\"_\\\"H\\\"S4]\\r<;L&Y)!:W(;E&k)!:W(;L)!:W(;L×)!:W(;L&2)!:W(\\x00\\x002&\\x00:S\\x00\\x00&\\x00(>&\\x00(>\\x00&\\x004T26\\r&E>\\x0024=26;F&4)E>\\x0024=26;F&<)E>\\x0024=26;F&/)E>\\x0024=26;F&	)E>\\x0024=\\x00\\\"\\\"/4T\\x00\\x00±26*\\n26#(;F&F);E&k)2:U26#(;F&F);L)2:U2	;L&)!:W6#(;F&F);L&Y)2:U2	;L&)!:W6#(;F&F);L&2)2:U2\\x0026;F&F);L&)&:U\\x00\\x00;;F&/)6~262(#:º0#:Ȭ0#:ȶ0#:Ȱ0#:Ȳ0#:ȵ0#:Ƚ0#:ȸ0#:ȷ0#:ȱ0#:ȴ0#:Ⱥ0#:ȳ0(>&\\x00(>\\\"\\\";G& ))96\\\"?\\\"\\\")j:n2;G&)\\\"\\\")3>,8/2\\x00\\x00.6;I&;)(\\x006\\x00!:}(;F&F);L×)2:U'	\\x00\\x00č?ĈĈĈ.\\x00:x(>#:ȹ(>\\\"#:Ȼ;G&);L&;)-3(>;D;G&%);G&{)-3(>\\\";G&));L&);G&)(3\\\";L&)#:ȼ(3;D;G&5));G&\\r)\\\"3\\\";HČ))&\\x00)(>\\\";L&\\x00))(>\\\";L&))(>&\\x00(>	\\\"	\\\";G& ))96A\\\";G&));J&a)\\\"\\\"	)(3\\\"\\\";L&\\x00))=\\\"\\\";L&))=6\\\";G&)\\\"\\\"	)3>	Y8N;	;G&)\\\";L&;)3<܋(>\\n;D;G&5));G&t)\\\"3\\\"\\n\\x00\\x000#(;F&F);L&Y)2:U#(;F&F);L&2)2:U\\x00\\x00\\n\\x00Ň;B;H&=)2(3;6§;D;G&%);G&{)-3(>\\\";L&)#:Ⱦ(3;D;G&5));G&\\r)\\\"3;D;G&E);O&B)-3(>\\\";L&))6K(>&(>\\\"\\\";L&));O&'))96\\\";G&)\\\";L&)\\\"-33>,8,;	;G&)\\\";G&)3<ۡ;D;G&5));G&t)\\\"3#G6;D;G&%);G&{)-3(>;F&)!:[(>\\\";L&)<ۿ;E&)/3\\\";L&);C&H) u;H&8)\\\" s;G&Y) u;E&:)(3;D;G&5));G&\\r)\\\"3&\\x00(>	(>;B;G&i)+\\x00;F&;)3(>	*\\x00\\x00¢?>>>;D;G&E) u-3(>\\\"\\x00\\\";L&L));G&)6\\\";L&L);Cě)-3;L&L)(,2	2;F&)6K;%;G&);B2	/3;D;G&E);E&)-36;D;G&5));G&t)2326*	;B;Gē)+\\x00;F&;)/3\\x00\\n#6*	\\x00\\x00Ñ?ÌÌÌ;D;G&%)#:m-3(>\\\"\\x00\\\"#:h)6±\\\";G&);F&Z)(3\\\";G&$);F&)(3\\\"#:h<܍-3(>;G&	)(>\\\"#:p<(3\\\";J&{);H&k)(3\\\"#:d;O&H)(3\\\"#:&\\x00&\\x00;F&.);F&i)u3\\\"#:d;CĚ)(3\\\"#:\\\";F&();F&)g3\\\"#:d;I&q)(3\\\"#:\\\";F&);F&\\\")g3\\\"#:13!:}\\x00\\x00\\x00̀?*++;D;G&%)#:m-3(>\\\"#:h#:å-3\\\"#:h;C&G)-3(>\\r?ʷʷʷ(>;C¼)(>;O& )(>	\\\";N¢)13(>\\n\\\";E)\\\";E&b))\\\"\\n/3;B;CĊ);FŻ)0;FƐ)0&\\x000;FƑ)0;Fƌ)0&\\x000&\\x000;Fƕ)0&\\x000.3(>\\\";N&)\\\";E&b))\\\"\\\";H&))g3\\\"\\n;L);F&()(3\\\"\\n;L&{);F&()(3\\\";Hõ)13(>\\\";LĤ)\\\";E&))-3(>\\r\\\";L&W)\\\"\\r\\\"/3\\\";Lą)\\\"\\r3\\\";LĤ)\\\";LÄ))-3(>\\\";L&W)\\\"\\\"	/3\\\";Lą)\\\"3\\\";Lþ)\\\"\\\"\\r/3\\\";Lþ)\\\"\\\"/3\\\";O&()\\\"3\\\";J&)\\\"3\\\";E&Q)\\\";N&)\\\";C&)3(3\\\";E&])\\\";I&w)\\\";I&	)3(3\\\";C&{)\\\";C&v))3\\\";I&.)\\\";E&Q))\\\"\\n;L))\\\";C&))&&\\x00&\\x00k3\\\";E·)\\\";E&]))&&g3\\\";N&-)\\\";C&))&\\x00\\\"\\n;L&{))g3\\\"#:m)=6\\\";G&)\\\"#:m)#:133*>\\\"7>\\\";L&B))6µ\\\";E&))0\\\";LÄ))0(>\\\";H&$))0\\\";J¾))0\\\";N&.))0\\\";C&P))0\\\";O&%))0\\\";H&))0(>&\\x00(>\\\"\\\";G& ))96S&\\x00(>\\\"\\\";G& ))96<\\\";L&B)\\\"\\\")\\\"\\\")3(>\\\";G&)\\\";H&))\\\";N&z))\\\";J))g3>,8I>,8`;	;G&)\\\";G&w)3!:}]\\x00>KW;.;G&)\\\"-3\\\"6G\\x00\\\");G&)692#:\\x00\\\")-3(>\\\";A=6\\\"\\\";G&<)\\x00\\\";Fż)J62;G&)\\\"3\\x00\\x00K2;C&g)13(>&\\x00(>\\\"\\\";G& ))96,\\\"\\\")(>2#:¤\\\"-3(>2;G&)\\\"3\\\"7>,89\\x00\\x00\\x00â;B#:)#:¢.\\x003#:­13(>\\\";L@));A6\\n\\\";L@))<p0\\\";E&h));A6\\n\\\";E&h))<p0\\\";E&7));A6\\n\\\";E&7))<p0\\\";E&));A6\\n\\\";E&))<p0\\\"#:¡);A6\\\"#:¡)<p0\\\";L§));A6\\n\\\";L§))<p0\\\";E&)));A6\\n\\\";E&)))<p0\\\";E&E));A6\\n\\\";E&E))<p0\\x00\\x00\\x00д(>;B#:@)(>\\\";G&)\\\"#:)3\\\";G&)\\\"#:ȿ)3\\\";G&)\\\"#:Ɋ)3\\\";G&)\\\"#:s)3\\\";G&)\\\";G&K))3\\\";G&)\\\"#:Ɂ)3\\\";G&)\\\"#:ɉ)3+\\x00#U(>\\\";G&)\\\"3\\\";G&)#3+#U(>\\\";G&)\\\"3?\\n#\\r(>	<p(>	\\\";G&)\\\"	3(>;N)(>;D;G&%);E&U)-3(>\\r\\\"\\r\\x00\\\"\\r;G&W))\\x00\\\"\\r;G&W))!:q6?\\\";G&);G&\\\\)-3(>&\\x00(>\\\"\\\";G& ))96\\\";G&)\\\"\\r;G&W)\\\"\\\")-33>,8)\\\";G&)\\\"3(>;O&)(>;D;G&%);E&)-3(>\\\"\\x00\\\";G&W))\\x00\\\";G&W))!:q6?\\\";G&);G&\\\\)-3(>&\\x00(>\\\"\\\";G& ))96\\\";G&)\\\";G&W)\\\"\\\")-33>,8)\\\";G&)\\\"3;B;G3))\\x00;B;G3))!:q6œ(>;Jì);G&);G&\\\\)-3(>&\\x00(>\\\"\\\";G& ))96<\\\";G&);B;G3);O&x)<܎\\\"\\\")6\\n<܆\\\"\\\")<p<ۦ-3;Gç))3>,8I\\\";G&)\\\"3(>;O);G&);G&\\\\)-3(>&\\x00(>\\\"\\\";G& ))96<\\\";G&);B;G3);Eî)<܎\\\"\\\")6\\n<܆\\\"\\\")<p<ۦ-3;Gç))3>,8I\\\";G&)\\\"3(>;C¦);G&);G&\\\\)-3(>&\\x00(>\\\"\\\";G& ))96<\\\";G&);B;G3);H@)<܎\\\"\\\")6\\n<܆\\\"\\\")<p<ۦ-3;Gç))3>,8I\\\";G&)\\\"326\\\";G&)2!:~3+#U(>\\\";G&)\\\"326\\\";G&)2!:~326\\\";G&)2!:~3+#U(>\\\";G&)\\\"3\\\";G&)#:ª\\\"%3\\\"#:)\\\"#:ɏ);B#:)(>\\\";G&)\\\"3\\\";G&)#:Ʉ\\\"%3#:Ɏ(>;;G&)\\\";G&)3(>&\\x00(>\\\"\\\";G& ))96\\\";G&)\\\"\\\")!>6&&\\x003>,8+;	;G&)\\\";G&w)3!:}$?\\x00\\x00%\\x00;G&@)-3	\\x00\\x00\\\\;;G&)\\x00;G&#)3(>;B(>&\\x00(>\\\"\\\";G& ))&596\\\"\\\"\\\")(>\\\"6	>Y8*\\\"\\\"\\\";G& ))&5)\\x00\\x00\\r?\\x00)\\x00\\x00u(>2#:¯)(>\\\"6`&\\x00(>\\\"\\\";G& ))96N\\\"\\\")(>;	;G&)\\\";G&))0\\\";L&	))0\\\";I&j))0\\\";I&o))0;G&)3(>\\\";G&)\\\"3>,8[\\\"\\x00\\x00g(>2#:)(>\\\"6R&\\x00(>\\\"\\\";G& ))96@\\\"\\\")(>\\\";G&);	;G&)\\\";G&))0\\\";NƊ))0\\\";L&	))0;G&)33>,8M\\\"\\x00\\x00l&\\x00(>2#:u);G&-)62#:u)(>2#:®);G&-)6\\n2#:®)(>?;D;J&*);O&\\x00)3'(>	(>;H&);B%(>\\\"0\\\"0\\\"0\\x00\\x00¦(>?LL;I)7:o\\\";G&)\\\";Gþ))3\\\";G&)\\\";J³))3\\\";G&)\\\";L&	))3\\\";G&);CÄ)\\\"%3?8II;;F&()6j\\x00:(;F&)!:[(>;;G&)<܇\\\" s;I&^)L3(>\\\"j:\\\";G&)\\\";Gþ))3\\\"\\x00\\x00Ƕ26<p(>;B#:Ʌ)(>\\\";G&)\\\"\\x00\\\"#:y)3;B#:Ɉ)(>\\\";G&)\\\"\\x00\\\"#:y)3;B#:Ƀ)(>\\\";G&)\\\"\\x00\\\"#:y)3;B#:Ɍ)(>\\\";G&)\\\"\\x00\\\"#:y)3;B#:ɇ)(>\\\";G&)\\\"\\x00\\\"#:y)3;B#:ɀ)(>\\\";G&)\\\"\\x00\\\"#:y)3\\\";G&);B;G))3;B#:@)(>	\\\";G&)\\\"	;G&9))3\\\";G&)\\\"	#:)\\x00\\n\\\"	#:)#:Ô)3\\\";G&)\\\"	#:ý)\\x00\\r\\\"	#:ý);G&)133\\\";G&)\\\"	#:÷)\\x00\\r\\\"	#:÷);G&)133\\\";G&)\\\"	#:Á)3;B;Gí))(>\\n\\\";G&)\\\"\\n;L&,))3\\\";G&)\\\"\\n;E&?))3\\\";G&)\\\"\\n;E&=))3\\\";G&)\\\"\\n;L&K))3\\\";G&)\\\"\\n;L&+))3\\\";G&)\\\"\\n;G&$))3\\\";G&)\\\"\\n;G&))3\\\";G&)\\\"\\n;L&))32\\\";G&();G&)-3!:}(2\\x00\\x00\\x00	\\x00!\\x00;F&0)^&P;F&{)!\\\"_\\\"S4]\\r;6;G¶)!:W(*\\x00\\x00K;6\\r&\\x00(>&\\x00(>\\x00&\\x004T26\\r&E>\\x0024#(>\\\"6;F&4)E>\\x00\\\"4C\\x00\\\"\\\"/4T\\x00\\x00;B;L&);C&)<p\\x00g3\\x00\\x00*;B;E&'))6\\r;B;E&'))(>?;O&g)!:o(>\\\"\\x00\\x00/<p(>?\\\"\\\"\\\";B;L&l))6\\r;B;L&l))(>;N&')!:o(>\\\"\\x00\\x00\\x00p;G¶)!:W(26;F&>)!:[(26\\r&;G¶)2:U?#(>\\\"6\\\"(&;G¶)\\\":U;B;L&J)+\\x00(3;B;E&F))6	;B;L&J)n3\\x00\\x00P;B;L&))6\\r;B;E&F));Ná)(>(>&(>(>;B;L&)+\\x00(3;B;N§)+(3;B;I&>)+(3+7\\x00¾263;D;G&%)#:£-3(2;G&))#:á#:ó(3;D;G&2));G&\\r)23<ۯ^;G&}).\\x00:];G&8)13(>(>\\\";E&.)\\x00(3\\\"#:_(3\\\";H)\\\"(32\\\"(3262;G&`);Oï);k;GƊ)\\\"-3(32;G&)\\\"32;G&`);C& )(3\\x00\\x00;k;GƊ)2-3(>(\\\"\\x00\\x002\\x00)(>\\\"67>2\\x003h\\x00\\x00\\x00(&;G¶)\\x00:U;F&/)7:\\x00\\x00\\x00\\x00%(>\\x00;F&4)^&P;F&4)!\\\"_\\\"S4]\\r27\\x00\\x00H\\x002;F&[)!:[134T\\x002;F&i)!:[134T\\x002;F&9)!:[134T\\x002;F&	)!:[134T\\x00\\x00\\x00\\x00+\\x00(4\\x00+(4\\x00+(4\\n\\x00+(4\\x00+(4\\x00+(4\\x00+(4\\x00+(4 \\x00+(4\\x00+	(4\\x00+\\n(4\\x00+(4\\x00+(4\\x00+\\r(4\\x00+(4\\x00+(4\\x00+(4\\x00+(4\\x00+(4\\x00+(4$\\x00;F&4)96&\\x00&5!\\x00;F&4)5!\\x00\\x00\\x00;F&4)96&\\x00\\x00&5!F\\x00\\x00&\\x00(>&(>\\\"\\x0096\\n\\\"$>>Y8\\\"\\x00\\x00;F&.)(\\x00;F&()(>;B6\\\"\\x00\\\"\\x00\\x00;D6&\\x00&\\x00\\x00;D;G&%);G&h)-36;F& );F&)\\x00\\x00;\\x00	;B;G))6;FÄ);FƊ)\\x00\\x00U&(\\x00;F&4)(;F&()(;B#:@);G&9));G&)6\\\"\\x00FF;F&4)F;F&<)!\\x00F\\x00\\x00;F&)!;F&a)\\x00\\x00;F&)!;F&()!;F&4)F5\\x00\\x00;F&)!;F&()s\\x00\\x00;F&)!;F&<)5\\x00\\x00;F&)!;F&<)!&\\x00!\\x00\\x00%;F&.)(\\x00;F&()(>;B;G&))6\\\"\\x00\\\"\\x00\\x00;B;G&e))6;F&)&\\x00\\x00;D;G&%);L&3)-36;F& );F&)\\x00\\x00;\\x00	;B;O&<))6;FÄ);FƊ)\\x00\\x00X&(\\x00;F&4)(;F&()(;B#:@);G&9));G&)6%\\x00FF;F&4)F;F&<)!\\x00\\x00F\\x00\\x00;F&a)(\\x00;F&)(!\\x00\\x00\\x00 ;F&)!;F&()!;F&4)F5;F&.)\\x00\\x00;F&)!;F&<)s\\x00\\x00;F&)!;F&)5\\x00\\x00$;F&)!;F&<)!&\\x00!&;F&)\\x00\\x00\\x00\\x00$;F&)^;F&4);F&<)P;F&/)PP&\\x00!\\\"Sŋ&\\x004,&4,;F&4)4,;F&<)4/&\\x00(>\\x00144Ì\\x00;F&)!:Q49\\x00 ~48\\x004;A=6&\\x004/\\x0048\\x006&4/\\x00\\x004C#:ɍ(>\\\"6;F&4)4/\\x00\\\"4C;F&)0;F&/)0;F&5)0-4g(>;;FƗ)\\\"\\x00;F&)-4Z6;F&:)4/\\x00#:à!O4V;6;F&>)4/\\x00;4T;F&k)!:Q(>\\\"&\\x006;F&z)4/\\x00\\\":ä;;F&<)\\x00 6;F&)4/\\x0014%\\\"/4V\\x00\\x00\\x00\\x00/(>(>&(>&(>&\\x00(>&\\x00(>&\\x00(>	(>\\n\\\".+\\x00$\\x00Ħ\\x000(>26\\\"(\\x00NB';F&R)\\x004\\x00\\n;F&)\\x0046\\r\\\"(\\\"7>\\x00\\x004BÝ;F&4)7>\\x00L(2=6\\\"7>¿\\x00L(µ2\\x00L=65\\x00L@6\\\"(\\n;F&)7>\\\"7>2\\n=6\\\"2\\n5$(\\nt26#;F&)2\\x00\\\"25;F)J6;F&)7>J;F&4)2\\x00\\\"25;F)J6;F&()7>2=\\x00\\\"25;F&I)J626;F&);F&()7>\\x00A2\\x0025;F&I)J626;F&);F&()726;F&);F&<)7\\x00\\x00F2\\x006>225(>,\\x00\\x002\\\"g4¼;F&<)26225$	\\x00(2(\\x00\\x00\\x00\\\\2(>2\\n=\\x0026	\\x002\\n5$>2	(>;F&<)26	\\x0025$>2z2=6\\x0025&\\x00¸2Ó\\\"ä\\\"ø\\x00\\x00\\x00(>&\\x00(>+\\x00M+¬\\x0022\\x00_\\x00(3,\\x00\\x00G2\\x00962;G&)&\\x0023,2;G&)2\\x00_-3;G&)2;G&)&\\x002\\x00_3-3\\x00\\x00\\x001\\x00;F&;)(\\x00&\\x00(>&\\x00(>&\\x00(>(>(>+\\x00M++k\\x00A,2\\n\\x0025\\x0062;F&)62$&(,\\x00((\\x00\\x002;F&)6	22s&\\x00\\x00\\x0032;F&4)62;F&)62&\\x002;F&)62&\\x00\\x00\\x00\\x00(>+\\x00²+|+\\x00	2\\x00(3\\x00\\x002\\x00)62\\x00(3	2\\x00$3\\x00\\x00\\r2!:5;G& ))\\x00\\x00\\x00\\x00;F&)(\\x00(>&\\x00(>+\\x00M\\x00C&\\x00(>\\\"\\x0096!2\\\")\\x00622\\x00_\\x00(3&>,8)22\\x00_\\x00(3,&\\x00\\x00\\x00\\x00*&\\x00(>&\\x00(>;F&)![(>#Z(>&\\x00(>+\\x00M+a\\x00a2-4M6P,\\x0025;F&)s!:$(>\\\"&\\x00o622;G&)13&/4|2\\\";G&)13&/4|\\\"(\\x00(\\x00(\\x00\\x002;F&)6221452s&\\x00\\x00\\x00;F&)\\x00F!:$;F&)s\\x00\\x00\\x00M\\x00;G& ))J6&\\x00(>&6*>;F&4)6*>*>\\\"!:5;G& ))\\x00;G& ))5&sF&\\x00(>\\\"\\x00;G& ))963\\x00\\\");G&)13(>&\\x00`2\\\")62\\\"&(32\\\"3,>,8A\\x00\\x00O&(>\\\"\\x00;G& ))96<\\x00\\\"&5);G&)\\x00\\\")(>&\\x00`2\\\")62\\\"&(32\\\"3,>,8J\\x00\\x00x(>\\\"\\x00;G& ))96d\\x00\\\"5&);G&)13(>\\\"5;F&4)(>\\\"\\\"o6;G&)\\x00\\\")$>>,8&\\x00`2\\\")62\\\"&(32\\\"3,>,8r\\x00\\x00\\x00/\\x00&^\\x00;F&4)^\\x00;F&()^\\x00;F&<)^;F&<)s\\x00\\x00\\x00(>&\\x00(>&\\x00(>+\\x001+2!_$,\\x00\\x00x22;G& ))&5)(>\\x00\\n\\x00\\x00\\x00\\\"6R2;G&)\\x003&\\x002;G& ))682;G& ));F&4);F&)FJ6!2;G&)2;G& ));F&)5-3(*\\x00\\x00)2;G& ));F&/)J6*2&\\x006	22s&\\x00\\x00\\x00\\x00/&\\x00(>&\\x00(>(>\\x00;F&I)@\\x00(>+\\x00Î+©+õ+\\x00\\x00(\\x00\\x00>269\\x000205(>\\\"&\\x00J\\x00\\\"\\x00o6\\\"$,\\\"296\\\"((\\x00\\x002&\\x006	22s;F&)\\x00\\x002\\x00\\x00\\x00&\\x00(>&\\x00(>(>+\\x00Q+c+u\\x008\\x000(>2=6$\\\"25(>\\\"&\\x00J\\x00\\\";F&;)o6\\n,\\\"$\\\"(\\x00\\x00\\x00\\x00\\x00.2&\\x00\\x00	2;F&)J6;F&)2F;F&&)F2s!:$&\\x00\\x00\\x00>;L&)\\x00;G&f)13@\\x00;O&d)\\x00<۠\\x00;OÃ)\\x00\\x00;Gá);Oĉ)-3\\x00\\x00\\x00((>;Fƈ)(>&\\x00(>&\\x00(>+\\x00Q+o+µ+\\x00;E&_)\\x00E6\\r2\\x00E\\x000(3\\x00\\x00M2\\x00E)(>\\\"=63\\x000\\\"5(>\\\"&\\x00J\\x00\\\";F&;)o6\\\"296\\\"(\\\"$,2\\x00E3h\\x00\\x002\\x00\\x002&\\x006	22s;F&)\\x00\\x00&\\x00(>\\x00>K\\r\\x00\\\")&\\x006>,\\\"\\x00\\x00&\\x00(>\\x00>K\\x00\\\")$>\\\"\\x00\\x00!\\x00À(>&\\x00(>&\\x00(>&\\x00(>&\\x00(>	&\\x00(>\\n&\\x00(>&\\x00(>&\\x00(>\\r&\\x00(>&\\x00&\\x00l&\\x00&\\x00{&\\x00e&\\x00w&\\x00b&\\x00&\\x00(>#a(>#d(>#b(>&\\x00(>&\\x00(>&(>&(>(>(>(>(>(>;F&)!X(>&\\x00(>&\\x00(>&\\x00(>&\\x00(> \\\".\\\"@+\\x00$\\x00;G& ));F&()6\\x00;G& ))$\\x00\\x00ʚ\\x004Bʓ	,\\x000(\\x00¯B\\x002&6;F&4)(2;F&()6	;F&<)(2&6	;F&4)(2\\x004Mȸ2;F&)6,\\x000(2;F&)6,\\x000(&(Ȃ\\x00(>\\\"6\\x0026,\\\"\\x00\\\"&\\x00624,2;F&<)6	;F&)(2;F&4)6	;F&)(2\\x004Îƪ\\x00@>6,\\x000(\\\"h=6\\\"\\\"´;F)o\\x00\\n\\\"h;F&4)o6\\r,,2;F&)6	;F&)(2;F&)6	;F&)(2\\x004©\\\"!&\\x00(Ī2;F&4)6	;F&()(Ĕ\\x00@>E6N26,\\\"E!c6\\n,2\\\"4Q2\\\"4Q;E&_)\\\"E6,\\x000(\\r<܉\\\"E6,»\\x00@>E6\\\"E!c62\\\"4o24,24l,24e,24w,|24b,2\\x004cl24,d24{,\\\\2\\x00@>L=624,\\\"L(?;NÌ)\\x00¾È6	;F¢)E &\\x00@>÷&6	;Fĸ)E \\\"Ö6	;Fû)E \\x00\\x00\\x00u&\\x00(>214¬(>&\\x00\\\";G& ))6	;F&4)r>\\\";G& ));F&)96;F&<)E>\\\"\\\";G& ))&5)\\x00:(>\\\";F&)6;F&)E>\\\"26\\\"(\\\"\\x00\\x00\\x00ƍ2&\\x00\\x002&\\x00(>22 P(>26;F&l)E>26;Fž)E>2	6;FĤ)E>2\\n6;F&~)E>\\\"6;F&c)E>22&\\x006;Fö)E>2!>2!>6;Fé)E>2!>6;FÝ)E>\\\"\\x002!>6;F)E>2!>6;F¾)E>2!>6;FƗ)E>214;FË)96&E>2\\r&\\x006\\r2\\r2\\r2s&\\x00(>2\\r&\\x00\\x00\\\";F³)J62\\r;F&4)J6;F&	)E>\\\"214uÐ2	&\\x006	22	s&\\x00ñ2	2\\nï\\\"Ç2Ï2Û2å2«2á2!eý2!fò214Ú22½2\\rÝ\\x006&\\x00\\r\\x00\\x005;F&I)o\\x00\\x00\\x00\\x00&&\\x00(>&\\x00(>&\\x00(>&\\x00(>(>(>+\\x00@+$\\x00Ì\\x00!:Ɇ$2=6F\\x00&\\x00)(>2\\\":(>\\\";F&)6#2=\\x002=6\\r22:$\\\"(\\\"$26	\\x00&\\x00)(\\x00\\x00;G& ))&5)(\\x00&\\x00)(>&(>\\\"\\x00;G& ))962\\x00\\\")@>0\\\"05;F&)96\\\"0\\\"05$,\\\"(>>,8?\\x00;G& )\\\\\\x00\\x00U2=\\x002=6\\r22:$2\\x00sÑ2&\\x006	22s&\\x00ö2&\\x006;F&)2F2s&\\x00Õ\\x00\\x00\\x00W&\\x00(4&\\x00(4(>(>(>&\\x00(>&\\x00(>	&\\x00(>\\nþæF(>&!`(>&!`(>\\r&!`(>+\\x00;+$\\\"\\x00¢\\x00£F(>\\\"26\\\"(&(4\\x00\\x00{\\x00=6u2\\x00412\\r\\x00¨412\\x00î41&(4#:7(>26,\\x00~2\\x0026\\\"7\\x00~(\\x00(\\x00~(\\\"(\\x00(\\x00\\x00<2=6/26 &26\\x0025$\\n\\n\\x0025$\\n\\x0025$	\\x00(\\x00\\x00(;F&)\\x00N6\\x007;F&))\\x00N6\\x00Ø7\\x00\\x002=6`#:7722	2\\n(>2×\\\"&\\x0062\\\"s;F&)â\\\"&\\x0062	\\\"s;F&)­\\\"&\\x0062\\n\\\"s;F&)°(>\\x00\\x00mmr\\\"Ù214Ã2\\r14¶214ą\\x00\\x00\\x00d&\\x00(>&\\x00(>&\\x00(>&\\x00(>&\\x00(>&\\x00(>	&\\x00(>\\n&\\x00(>&\\x00(>&\\x00(>\\r&(>(>(>&\\x00(>&\\x00(>&\\x00(>#Y(>#\\\\(>\\\";+\\x00$g;F&)\\x00N6I,\\x00(>&\\x00(>\\\"ÊB,&(>,&(>,\\x00\\\"6\\\"7\\\"Ä6&(;F&:)\\x00N6&\\x00(\\x00\\x00²26¨2\\x00025!:>;F&)J6&\\x00\\x000-4$(\\x000-4$z(\\x000(2B\\n,,,\\r,\\x002\\x000\\x00ó/4M2=6\\r2\\x0002/4M2(>;Fé)\\\"6,;Fƒ)\\\"6,	,\\x00\\x00\\\\2·2ù2ÿ2Ă2	ć2\\në2Þ2Ô2\\rí2ü2ß2»214a!]Æ214!]ã214kè\\x00\\x00\\x00w\\\"@!:ɋ(>#:ɂ(>U!g(>	!W(>\\n\\\"	\\\"\\nj(>ărêAi(>#h(>\\r#:ɓ(>&\\x00(>(>!:ɔ(>*>\\\".+\\x00ª\\\"j+$M\\x0060\\x00;G& ));F&<)J6\\x00&&A:ù\\x00:ò(>\\\"62\\\"4¤\\x004@2	\\x004@2\\r\\x004@\\x00\\x00W2\\x004.2\\x004.26\\x000(2	\\x004.2\\n\\x004.2\\x004;2\\x004;2\\x004.;F&)\\x00N6*\\x00\\x00;Lá)-4û(>\\\"6\\r2\\\"&:ɐ4ð\\x00\\x00#H(>\\\"&2\\\"4j\\x00\\x00H&\\x00`6&\\x00(\\x0025!:>;F&)J6&\\x00(&!:ɒ(>2\\\"4¿;Lá)\\\"14Ć/4ā\\x00\\x002n4¡\\x00\\x00\\nþ#H(>(>214Ò(>\\x006/\\\";G& ));F&<)J6\\\"&&A:ù\\x00:ò(>2\\\"-4$(>&\\x00K#:Å\\\"&\\x00A&\\x003&\\x00&\\x00±(>\\\"72\\r\\\"-4$(>2	\\\"-4$(>2\\\"\\\"\\\"\\\"L4$(>\\\"0\\\"0!l(>	\\\"	33\\\"	AA\\\"	\\\"\\\"\\\"	KK2=6\\\"25&\\x00D\\\"ì\\\"¦\\\"À2\\n\\\"-4$z214$Â214$§\\\"Å214$É\\x00\\x00¶&\\x00(>&\\x00(>&\\x00(>(>&\\x00(>&\\x00(>\\x00(>\\\"\\\";G& ))96R\\\"\\\")(>	\\\"	\\\"\\\"	KF$>\\\"	A\\\"	KF$>\\\"	36&;F&)\\\"	KF$>\\\"	K$>\\\"	6	\\\"\\\"	:ɑ>,8_\\x00;G& ))(>\\n\\\"\\\"\\nsK\\\"&\\x006\\\"&\\x00A\\\"\\\"\\ns\\\"\\\"&\\x003\\\"\\x00\\x00\\x00\\x00\\x00\",ǫǪǬǭ͞ΓǮǯ\x00«ǠǡǢǣǤǥǦǧǨǩʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿̡̢̛̖̗̘̙̜̝̞̟̠̣̤̥̦̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̕̚Ƃ$ƃ&ƄհƅճƆյƇչƈջƉսƊČƋďƌĒƦ˿ƧƨƩןƪסƫשƬؒƭؘƮؚƯ»ƶÈƷÍƸÒƹëƺʵƼԸƽ׮ƾ׳ƿɉɺ֚ǂֱǃֹǄ̩ɻ̵ɼ͍ǅ۝ǆЛǇƐɽיɾכɿϯʀϱʁϵʂϻʃϽǈϿǉέǍ˶ǎÜǏАǐВǑǒǓǔǕǖǗǘðǙĂǚćǛɮǜɳǝɵǞʑǟ۩ſɂ ×ðĦ½äĈüŃóï±41¶ħĖĐ¶ìĊĖ ¶ØĖ¶ĪŶ÷1¶ħġĖĤ¶ûTİ1¶ħĸĖ¶čėĖŬ¶cŎĖš¶^LĖÕ¶HĽĖ¶¾fĖ¶¬ÎĖ¤¶ŪÊAçyĖ¶=ī`\n1źŅĖË¶{©P1¶ħĖĚ¶<ĎĖĶ¶ĭĉĖÑ¶ĮĳAÇĖ¶ĲīŊĖ,¶.ArěĖ¶ÌīŢĖ¶vCAdĖ¶¶īĖœ¶ċÔŵ1¶ħłĖń¶ĂAŭķĖå¶¶īÒAÙ0Ė¶īÃĖŷ¶Ňkm1źáA@8Ė*¶¶īŋĖ§¶XĹ1ź£Ėò¶ŽĖ¶ųq1źŉĖ¹¶aĖ\x00¶ďĖn¶ăőA'ŚĖ¶­ī´Ý1¶ħRĖx¶úAÉJĖ¶ŏīŐĖB¶ĠĿĖř¶Í¥Ā1¶ħśĖê¶DSĖŕ¶NøĖ¶_tl1¶ħğĖG¶$ÐĖi¶ŸāĖ¶ÛĖ\r¶ůºĖÿ¶|wĖp¶ĔĖĝ¶ß)ĖÈ¶~A;ļĖ¶Ęīıą1¶ħĴĖù¶ë°ĖŖ¶\\ôĖŰ¶gĖ¶ŧŜAŦĖÞ¶¶īŞ¯¦ūĥÖU²ñýęIF	¸ÏŻuOs¼%Óũ&Ł9¡«-ŗĺ»þ%3V#ĕŹã5}ťÂēűđoéĞ\"à¢Œ(ĢÚÁ1ĵűĬĖeÄŮjz³bª[ľģ1WM1Y]1KŤ12Å1Ą1ō¿1ţõ1Ü1Ļĩ1h?1ňŴ1îŀ1ņèžÆ6Ē®·ŝ+Ũ!>íŘį:öµŔQŲ¨şZć/æŠČâĨÀżEĜŌ7Ć/Ĺ7ǰ	\n\rȅ\n5ʇȤି\r>\rĉ\rB	́\r	׸	ࣸ		౟		ֱ	ۦ	ఔ		࢟		ଣ\n#	]ʆӯ\nHǱл࿣ȡǲ	\n˭\n൨\nб\nຊ	\n\n\n\nɘ	]ȡǳ	\n˭\n໲\nб\nഅ	\n\n\n\nɘ\n˰\n్\nĶ\nՄ	]ȡǴ	\nл	Æ\n\nđ\nཧ	ශ\ń\n۔ʆӯ	HǵǰဇʈࢸǲʏൄǴʒώ	ʺʍːʍɵ˃ǰʐ˛ʺ\r˃\nʾǲʑ౽ʫǱʑ̝ʾ\rʫǳʏͤǳʑܜ7ǶǱʓન\rǴʏΆǲʑφʺǳʏÌ˃ǲʐߗʺ\r˃Ǳʑ˥ǳʒ଺ʫǰʐၛʯǴʔཌྷʫ\rʯǳʑҹǱʔઑˀǱʎ෣˃Ǳʔఠˀ\r˃˃Ǳʒʩˀǲʔ̝˃\rˀ˃Ǳʓ؊ʯǱʑྱ˃\rʯp7Ǳʏહʭʒ੐ʐĩʫǲʒ࿰ʭ\rʫHǱʓɷǲʓʦǳʔɠ˃Ǳʎ໣ʱʏडʎૣ˃\rʱʺǳʐ࡛ʫʎӑʏْʺ\rʫʯǴʐ۬ʱǲʐ೟ʯ\rʱǷʾǲʐګʭǲʓΤʾ\rʭ Ǵʑϸ!ʭʎŘʒकʾǳʔЇʭ\rʾ\"Ǵʑ՛7#ǰʐɎ$ʾǰʒ༺ˀǴʐބʾ\rˀ%ǳʏऀ&˃ǲʏ๰ʫʎǳʔர˃\rʫ'ʭʍόʐੌ˃ʐЭʐຸʭ\r˃(ʺǲʏƍˀʓࣣʐАʺ\rˀ)ǳʏա*ˀǱʏ௨ʺǱʑƁˀ\rʺ+ǲʐա,Ǵʔီ-Ǳʎ҈.Ǳʏੂ7/˃ǰʓڬˀǱʒஏ˃\rˀ0Ǵʓϖ1ǳʒ࢝2ǳʐ࿟3Ǳʐʫ4˃Ǵʑྙʫǰʔহ˃\rʫ5Ǳʔ৏6ʾʑටʏŶʯǲʔ౦ʾ\rʯ7ʭʏʒʍśˀʐ͍ʏޓʭ\rˀ8ǲʓࣟ9˃ʍࣅʎfʫǳʐƁ˃\rʫ:ǳʓ՛s7;ǱʔƼ<ʾǲʔՆʾ\rʾ=ǲʓɠ>ǰʒɷ?ʱʐଛʐ҅ʭǲʐΑʱ\rʭ@ʫǱʏଟʱʌຩʑဘʫ\rʱAԳǰʒͣBǱʓྗCǳʔຒDǰʒքEǰʑԗF˃ǰʓ۲ʭǲʐˊ˃\rʭpa7GǰʑԣHʭǲʒמʾǱʐЇʭ\rʾIʯǲʔ௣ˀǴʒܾʯ\rˀJǱʓϸKǲʔۑLǱʔքMǳʐƼNǳʏЋOǲʐ˥PǳʔစQǱʏલRǲʑѽm7SǳʑӏTǴʑЉǸǴʏƼUǱʏƉVʯǴʒ΄ʺǱʏ̝ʯ\rʺWǲʑϖXǳʒϹYǰʑɊǹʺʍผʒğʱǳʔۧʺ\rʱZǱʏ୸ǺˀǱʒॕʾʑޒʍԑˀ\rʾ[ǲʐΗa7\\ǳʏӏ]ǰʎȌ^ǲʐƉ_ǳʑഉ`ǰʐ͸aǳʓϢbʭǳʐǲʱǳʔലʭ\rʱcǲʑӵd˃ǲʎ઎ʭǲʏହ˃\rʭeǴʐ֝fǱʓɓgǳʔѽ7hʺʐɥʓ®ʱǳʐߤʺ\rʱiʭǴʓתˀʔӣʒעʭ\rˀjʭʓ஧ʏo˃ʎ͝ʏঢʭ\r˃kǳʒʦǻǰʑ͸lǴʐɑmʺǲʏీʱǴʔடʺ\rʱnǳʏϾoʫǲʓ൶˃ǳʐێʫ\r˃pǱʔࢉqǱʓѺr˃ǳʑ୙ʾǱʓ૨˃\rʾpy7sǰʔηǼǳʑ̸tǲʏѦuǱʏഒvʫǳʐصʭʒॹʒгʫ\rʭwǱʔ๣xǲʔΝyʱʍǭʑཝˀǲʓࡓʱ\rˀzˀʌǞʍʕʾʏടʍईˀ\rʾ{ʱǱʑั˃ʐࣙʐഋʱ\r˃|ǳʑՉ}ǳʔྸm7~ǳʒࣹǲʐˉʯǱʓ͕ʾʒѸʐीʯ\rʾǲʔϑʾʍːʍɵˀǰʒ܅ʾ\rˀǲʏɠʾʔ୫ʎ໮ʯǳʐ߆ʾ\rʯǲʑμǳʏ༏ǳʑϾǳʑȣǳʒၙa7ʾʎ׭ʍX˃Ǳʓྔʾ\r˃ǲʑѰǳʓЋǳʓ˱Ǵʑֲǽǰʓѭǲʒɀǲʑ˵Ǳʐড়ʫǱʏົʯʓόʓ୼ʫ\rʯǱʐܳǲʏΗy7ʱǲʏȬˀǳʐঝʱ\rˀǲʐȌǱʏޮǰʏʊǲʒӜʭʒؒʐƬʺǲʑ୕ʭ\rʺǱʏܔǲʓ՚ǱʏɊʺǳʐӀʯǳʓՎʺ\rʯǳʎȣ ʱǴʔאʾǴʎഘʱ\rʾp7¡ǰʑȌǾǲʏҹ¢Ǵʏ࠺£ʯʏܯʍŋʾʔઊʎАʯ\rʾ¤˃ʒ߭ʑƗʱǲʑ༖˃\rʱ¥ʱǴʔƍʯǱʒΤʱ\rʯ¦ǳʑƼ§ǰʏϙ¨˃ʒ͑ʒõʺʓ܆ʑ๼˃\rʺ©ǰʔʱªǰʓࠒ«ʾʐৌʓÂˀǱʎໞʾ\rˀp7¬ʭǳʑ׆ʫǳʐ໛ʭ\rʫ­ʾǳʑѹʺǰʓͱʾ\rʺǿǳʎϓ®ǲʏɓ¯ǲʔɷ°ǲʔѰȀǱʒЉ±ˀʔ߿ʑʾʭǱʒಝˀ\rʭ²ʫǱʒכʯǰʐࢥʫ\rʯ³ǳʐӜ´ʾǳʔӀʺǱʎ໿ʾ\rʺµʫǰʑͬʯǳʎྋʫ\rʯpm7¶ǰʐԉȁˀǰʏƅʺʍӿʌࠂˀ\rʺ·ǲʑফ¸Ǵʓ๥¹ǲʑώºǱʐङȂǴʒˠ»ǲʓ૵¼Ǳʓ٤ȃʭʔ̈ʏfʺǲʒ෹ʭ\rʺ½ʯǰʔπʾǳʍಔʯ\rʾ¾Ǳʑဓm7¿ǱʔஜÀʫǳʑ஌ʾʔമʒࣛʫ\rʾȄǳʎȨÁǲʐɫÂǱʔˠÃǳʑяÄǳʓͣÅǰʒ෢ÆʯǲʒࡿʺǱʓয়ʯ\rʺÇǳʏ೥ÈʫǴʒુʱǲʏ˛ʫ\rʱÉǲʔ༒7ÊǰʔʫËǲʏϹÌǲʐϓÍʱʍʒʓ¬˃ʑபʑફʱ\r˃ÎʭǱʐ࣊ʱʐෳʍ৙ʭ\rʱÏǲʏμÐʺʑӬʏӾʫʓটʓ෬ʺ\rʫÑʱǱʐྍ˃ʎӬʐनʱ\r˃ÒǲʑԹÓǱʎɫÔǱʒӇÕʱǳʓͬʫǳʓ໡ʱ\rʫpm7ÖǳʓԹ×ʾʒ௜ʑðʫǰʒˊʾ\rʫȅǳʏसØʱǱʓҀʯǴʔݢʱ\rʯȆǲʎɑȇǱʓԗȈǲʒȗÙʯǲʔਬʫǳʏъʯ\rʫÚǲʔɊÛǴʏʱÜǳʒ˵Ýǲʓන7ÞʺʍӿʑʱǱʓઢʺ\rʱßʫǰʓംʯʔ်ʐ஭ʫ\rʯàˀʓܺʎõʯǱʒਇˀ\rʯáǳʏໜâǲʏԉã˃ǰʑ͕ʫʑ׀ʐ༄˃\rʫäǴʑ૶åǲʒૈæ˃ǳʔÌˀǲʓ࿨˃\rˀçǰʔ೐èǲʓʫéǳʏݿm7êǳʑӹëˀʔ࿝ʑӾʯʔ౵ʑ۴ˀ\rʯìǴʔ˥íǲʒˉîˀʐՙʑǬʺǰʐұˀ\rʺïǲʑΈðǲʓԍñǰʑɎòǲʓɫóǳʐȨôǱʑɮõʯǱʏؚʱǳʔՒʯ\rʱpy7öʱʑ؍ʏƗˀǳʐҮʱ\rˀ÷Ǳʔ໥øǰʎܱùʺʏ൬ʒ¬ʾʔΩʑཊʺ\rʾúǱʏࠖûǲʔ߷üԳǳʑƉýǴʐѺþǴʐӛÿʯʍǭʐ|ʺʔӑʏ࿐ʯ\rʺĀǳʑȗāˀǱʒؗʺʐݵʏߝˀ\rʺpy7ĂǱʏ̸ăʫǴʎߠˀʌːʎگʫ\rˀĄǲʔʊąǳʒັĆǲʒыć˃ǳʔ༢ʫʒ֤ʔ࿌˃\rʫĈǲʑѦȉǰʒɑȊʾʎ಻ʔɵˀǰʐඍʾ\rˀĉǲʐՉĊʱʑəʒȺʾǱʒٚʱ\rʾċǱʒםa7ȋǱʏΝČǱʓяčʫǳʐÌˀǱʏЦʫ\rˀĎǱʏȌďǳʐȗĐǱʓϑđʱʒࢺʍİʫʒ͝ʒ৛ʱ\rʫĒǲʓȨēǳʓηȌǰʓՌĔǲʓ࿤ĕǲʒ؂m7ĖǲʔӹėǱʔ಩ĘǱʓɀęʺʏɇʓŝˀʓӣʐࡃʺ\rˀĚˀǲʐեʯʐΩʓ܎ˀ\rʯěǳʒΈĜǳʐಃĝǱʓɎĞǳʓƼğʫʌ̹ʌ¯˃ǰʔഢʫ\r˃Ġǲʏ཰ġǰʓરa7ĢǲʓॠģǴʐඁĤǲʑΆĥǱʐϢĦǴʒ৬ħʯǳʐ཈ʫǰʑ࿭ʯ\rʫĨǰʒȣĩʫʍӟʓˀǰʒఙʫ\rˀĪǲʏыīǳʑְĬǳʑ͛ĭǴʔ๡y7ĮǱʔ˱įǲʐʊİǲʏिıʭǴʐຈʯǳʐЦʭ\rʯĲʯǳʑ৳ˀʒ่ʒܓʯ\rˀĳǲʐɓĴ˃Ǳʏ݇ʫǲʏ܊˃\rʫĵǴʏφĶǰʏူķʾǱʔࣳʭǰʔੰʾ\rʭȍǱʎ೺ĸǰʔ׶7ĹʭǱʌʩˀǰʏͱʭ\rˀĺǱʔ֢ĻǰʐɮļǳʑͤĽ˃ǱʏТˀǱʓƁ˃\rˀľ˃ǰʑÌʱǲʑԾ˃\rʱĿǳʏהŀʯǲʑ।ʺǲʒՎʯ\rʺŁǱʔऋłʾʌ̹ʍwʺǰʏ਴ʾ\rʺŃʺǰʐ௖ʾʓ͍ʏպʺ\rʾńǲʔછ©7ŅǲʑȨņˀʎ೹ʔʭǳʓՆˀ\rʭŇ˃ʒӟʏبˀǲʏұ˃\rˀňǰʐȣŉǴʓ҈ŊʱǳʐҀʫǳʒऻʱ\rʫŋǱʎˉŌʭʏဢʎğˀǳʔԃʭ\rˀȎʭʌ̹ʌOʱǲʏૐʭ\rʱHōʭǲʑ࿷ʾǱʐՒʭ\rʾŎʫǳʓ൯ʭǲʔԾʫ\rʭŏˀǰʒฌ˃ǲʔຶˀ\r˃pm7ŐǱʒझőǱʔ෦ŒǴʑɀœǰʔ४ŔǰʐڹŕǱʐ՚ŖˀǲʑπʺǳʐӴˀ\rʺŗǴʓӛŘʱǱʔػˀǰʓ֛ʱ\rˀřǲʒ͛Śʺǲʎ֯ʯʑʒʑٝʺ\rʯśǲʓ࿅7ŜǱʒ˱ȏ˃ǰʑƍʫǱʒڸ˃\rʫŝʯʍǭʑůʭǱʓेʯ\rʭŞʫʔ͑ʑȉʭʎǳʑआʫ\rʭşǳʔ˵ŠʫǱʑ़ʭʏࣘʓԑʫ\rʭšǰʔܚŢǰʒේţʭǰʎࡢ˃Ǳʓ໋ʭ\r˃ŤǲʒոťǳʔၗŦǱʓඌ7ŧʯǱʎѹʭǳʓΑʯ\rʭŨǱʓ̸ũʺǳʑǇ˃ǱʒӴʺ\r˃Ūǳʐ΅ūǲʒࢷŬǴʑ೴ŭ˃ǰʑ૑ʱǱʒҮ˃\rʱŮǳʑոůˀǳʑ௷ʺʓ਩ʔгˀ\rʺŰǱʑ΅űʺǳʌʩʭǱʎ࣑ʺ\rʭŲǳʏڛm7ųǱʐʦŴǰʓʱŵǲʔཹŶǰʎӇŷʯǲʔեʭǲʔැʯ\rʭŸʺǱʒТʫǱʏˊʺ\rʫŹǰʓ෰ȐǱʓȗźǲʏ؄ŻǴʎӵżǲʔՌŽʱǲʑȬʫǱʔབʱ\rʫpƧ7žǲʓɮſǰʏԍƀǳʎˠƁǱʐԣ^ʡĊưʉఒȑʵʌ๴ȒF	ʵʌ໫Ʉʌˣʌৡ	ʍ׍		ʳÈʌȸ	ʌآʳÈʌǫ	ʌ໒ʌգʌəʌ೰ʌǳ	\rʡѸʡ̈ƍ	\n\rʌáʡƧʌˍʌ࿧		ʌ!	t\n	~Ɂ\nʞˌʌ\nʌ߄ȓF	\nÆ		ʉ	t	m\n\nʉô\n0Ĝૼʉߩڈ৞	˳Ȕ	\nȥ,ʌȎȿ©ɺ		&ʌv\nʡǈǺGʡǈǺȓŮಙʉξ	Ơaʉమ\nņңʉନʉૉȕF	\nÆʉไ6	m\n\nʉඝ\n̼	1ʉ१		ྚʉਢ	ܽ	1ʉథȖ	\nၡ,ʌȎȿ©	ʡǈǣGʡǈǣȕŮ\nʌvƐB\n	ņ\nңʉଥ\npɷ7ȗ	\n6ʌྪʌĹ	\nబʍ၍	ԴȘ	6ʌඎʌඉ	4ʎ஢	Hș	\n	ʌΟ\n\n	\nĴ\nÈಅȚ	m	jB		ßƎmʌ!ĴʌɳҾʉોț	\nʡƧʌʌ߽ʌ઼m	>	ʌ!	t\n	~\nʌ̢ʉҜˌʌ\n¼ʉÌʵʍʉ࿵ʉ࠴Iʉ਱	ʪʌੁŤˌʌ\nʉྈ	ʌဪ	ѠʡÖʌ̑Ə৾țʙJʡਮʌHȜ	\n\rྫ	Ƀʌࢢ	ʌ«ʉŌ	๿\n	ȶʌƔʌϏ\nʌv\nೕʌ࣓\nે\nʵ೅Ơ\nयƳ\nʵŭ෕\nʌî຃\nʌîຑʉÌढ\nÈʌ൰Ƴ\nʵŭ\nʌîࠁ;\rʡÖʌ\nʌϏʌౙ\rʌǒǅ\rȝ	\nʌĀʉ?	\nʌv5ʇʙ	B\nഃ	ʉʁ	ʉǎ	ʉߥ	༫Ȟ	\n\rʌv	\nʌΜʉ?\r5ʇʙ	B	į\r\naʉåʉ3\r\naʉÅʉ3\r\naʉ½ʉ3\r\n#1ʉƏ\rȟօaʉåʉϰaʉÅʉϰaʉ½ʉ31ʉൿȠ/ȝøࣁɵ7ƐFˍʔஆˍʐઙ6ʡġʌÓ2ʑష௬ƑFʵʌৄʌ੪ʵʌʠʌਸ਼Γĝ˛ȡ	\nɃʍฏ	ʡʓʌʌ࠸	2ʉࡏ\nʡʓʌʌച\n,ʉù\n	Ļ	ʌংʡġʌˌʌ	ڋȢʀȡøʡ௄ລ	ऴȣʣȤÑȤF	ˍʌ׬ʒౢƐʌ຦	yʌ̳ʌ߇		ڗʡཁʡΣʉܧɂ	ʌ൉ɂ	ʌඨȯ	Ȯ؉ϭȮÑƒ2ʽ֦,ʌுʌفۺɀܠRʣȤʣȓȯເȥFɒʉ੻Ü˖˖ʌΞ˖ʌʸ֩ʮʌɇ\rʌܖȦ	\nñ൳\n5ʤѧ\nʌҼʞ	ဂ׌	ࠎȧ	\n\rʌ୔n	ʌݟʌO	ȥ\n	<	8	फ़\n6\rȷɐ\rː\rx\rː\rYǡ\n\r~ʌ຀ʌ!tȦ7ÓÜಓΘӪ޻Сʌ!t~ʌৃʉڂ੺Yצޫ5ʤѧʌҼxŇȦQ7ÓÜພΘҴୠӪʡВʉùʡþʉ֫N૦N,ʉ൧දʣ6Ȯžʣi,iʡܘʡ೤ȨئȧHȩ	֠ʡþʉ૽ȧ	஝	C	ʍ۫ʌઔ	ʍ੮ʌശԥ7ƓάʡþʉઇʡܨʉƉȪಱʉܩIʉ࠮ʉദIʉঞȫˆʉ଀IʉϙȬ	\nˋʌ߬Ȫॼ		ʌ!	t\nˋʌ	ÓȪ\nǄȫ\nʨʉش\nʨʉ೒\nʨʉल\nୡʉඳ\nʡġʌʡǁʌ¼	০ȭ	\nñ2ʌԟ2ʌಂ,ːٓ\nȬ	Ó\n\n2ʌԟ\n2ʌ໯ȮF	\nȑʳ	ʧƀ	R,ʌȸ	ʌ̲,ʌǫ	ʌϱ\nխʌюʌUʌտʉ̌\nʡ஘\nʌ౎JʌˣtȒiʌգʷ\rʍ՟nxˑY	7\n+ʡr'ʍʬ्ȯ	\n\r		J	t	i	n	x	Y	7	+	'ʡǂ	ˎ	Ǡʡǂ	?ʡྐɁˁà	Nʉॖ\nȑ\nʧƀ&Ƴ\nʳÈʌȸʌ̲\nʳÈʌǫʌϱ,ʡ༲t	?ɛˍʌΪʌड़ʻʻʻ~ʻȂʡ௺ɂʻʏল	Nʉҿ	p\rʳ~\r,ʑฦ	Nʉպ	࿳ȭ\rʡQ	JŇ	Nʉҿ	pə׷ȑÕʌюʌUʌտʉ෻Ɂʌ࢑˒ɚʡٵߨɂnàʡǁʌnʌ๢ʡūʌસʬ	ʡūʌ൚ʬRĽ	NʉOʻn\r4ʻi\rɁʌಬʻi\r7\rɁʌ෨ʻi\r7\r+\r	?ɛ+Ƈʻi\rɚ7Ť੃	N		N੘	nʳ	xˑʧÈʡࡔʧ಍ʳÈʌȸ	Yʌ̲ʳÈʌǫ	Yʌྕ	Yʧʡūʌ˒ࠫʬ		7ʡƜʌʬ˒	7˒	+ʌձ	'ʍʬ	iʡƜʌ	nʷ	xː	Y	tʡƜʌ	i	7	+	'ʡƜʌ\nʌ෮ːʡƜʌ	xː	Yညʡþʉૹ,ǄȨ	ʋ	2	ǠȜ	7ঢ়ȩ	ĻȢ	7à	Nʉܮ		NʉϤ	N2ʉȞ	N੓	Nʉݶ6	Nʉଶ	'ʌݍʌΐʌૻʌ̭	'ʌ൑	Ȱ˖˖ʌॾ˖ʌڧḜ̩ʤʔ௵ʌ΄̩߯ʌǭʡ̏ʌ	Ťʌࢡ		̩	ˋʌࢋ	֬ʡǁʌʎ૱	ʌĞʉƅʉ̨࣏	\n૗๋̧ࡆʩàʪ4ʎકʪ৘ʎƄˎʌȐ\n߂,ʎൺʌ!ຂ\n̨˾ʌਟʡÖʌ\nʌմʌڿ	jBˊʌæʌɸʌ	à\nʌ$̧	Ťʌǳ̨	৐ʎՙʡÖʌ\nʌմʌڻ̨HƔಮ˔ʴʌʜʡΣʉ೷˔ըƕ^ʡúʼ̫%اƖԮ˖˖ʌΞ˖ʌʸȄʮʌɇ\rʌ࿦	^Êȱ	\nʔ஖\rʑx	ʌÇ\nʌȰխʡӊʉ̓ʡӊʉǑ\rʍɥ	ҝ\nʡਦি\rʍɥ	ҝ\n௽բ	բ\n]pǯ7Ɨ̧6ʌ৩		ʌ֌௾	ȱ̧ƈȲ	\nʑī	/\n¢ʌ!0	\nʡūʌȕʉƅ	\nɘʡūʌһʉƅ\nʉશ	Ƙ	\n\r\nɒʉ܋˂ʌી˂ʌਰʉ࿃5ʦÕʌஐ๾\rɐ\n\r	\rȲ\rўĴȂʌҜקҸ,ʉɒŢ˽5ʦÕʌཕ88%Hȳ	Æ			0	ྴȴ	\n	/,ʽ	ʌЎ\n\n\n0	\n\nΒ	ƙ	m		ʌ!	Ĵ	È	]ʉࡴƚࠧ\"ཫஒƛ	\n/	¢\n\nʌ!\nt\n͜ʉô0ழà	ࢧ	ߜ	ϭƜ	\nƮ	ͅ\n¢0³ʉߦ\n	Ƞ³ʉࣚʉNະ\n\"ƱʉคƝ	m		ʌ!	Ĵ	୅ƞ	\n	ў\n\nʌ!\n࿇\nඩ	׳	ȵ^ʡúʼɾĸй7ȶ	5ʇ	Ɛ	B	#ȵʉԃƟ̧^̧ʉЛ̧1ʉ௫ʉন̧ÊƠ	\nٷ		ʌҞ	ز	Ż͔	\n		\nʡúʼɾʉ೙ơFmIʉƾ0ˡʉξˢʌ!0ˋʌˢݎ˜qʉO˝\"ʉ?˞Ǹ1ʉƞʉ?˟\"ʉOˠǸ1ʉˬʉTˡȷ	\n\rȥ,ʌȎȿ©&ˢ\nʌv	5ʇʡЫ:ʉ൅ʉࡇʌÙʉप\nB\r\nį	#\r\"ʉʺ\nį	#ɽ\r1ʉˬʉӽ\"ʉи\r\nį	#ɽ1ʉƞʉ७\r\"ʉ೸	#\r1ʉШ\nʌ໽\r\n	#\r\"ʉʺ-\n	#ɽ\r1ʉˬʉӽ\"ʉи2ʽ		#ņ1ʉƞʉࢳʡÖʌ	̑ȸ	\n\rƮࡘ็ʌ੥ʌv	5ʇʡú:ʉܥʉҰ%ʉɚƠ\nˋʌ÷ˋʌ÷ˋʌ÷\rˋʌ÷	#˜\nš˝	#˞š˟	#ˠšˡ\rER\nˋʌ÷ˋʌ÷	#˜\nš˝Rˋʌ	#˞š˟ಿ	ȹȸøȼHȺ	\n\r	ʌv\n5ʇ	Ȥˋʌ੕ʉྻ\r>\r	ĉ\rBˋʌ\r9ʉكʉ॒9ʉԡʉ،9ʉ৮ʉཙ9ʉೀʉว9ʉ߀ʉ֐9ʉ׊ʉ૭\n#]ʆʌȝ\nHȻ	\n/ˋʌʌ۟		ʌ௱\n	\nʉ༠\n\nʉ࣎\nʉ๹Ĝ\n1ʉƒʉ̮	ʥʉǲ	ŭ\nʉ૴Ĝ\n1ʉƞʉՊ	ʥʉƒʉ̮	\rʉХʉǲ	ʉఐ\nʉཥĜ\n1ʉॎʉअ	ʥʉƒʉՊ	\rʉХʉƒʉ̮	\rʉၝʉǲ	ʉछ\nʉఘ	ʉ๩\nʉ൫	ʉ֭	ï=ʉרʉΕʌԆ\"ʉدʉّ³ʉޞʉງʌ$øȼ^ȽȻԴȽ	\nɺ	,ʽ		ʌ࿑\n5ʇʡЫʌĀʉ౶	%ʉ࢞ƐB\n#ʆʌȝʌʉ౴		\n#ʆʌȝʌ	ӨʡÖʌ\n̑Ⱦ^ˏ˓ఱщ7ȿ	\n	Ⱦ\nʌv5ʇ\n\nʉѕ	\nB	ˋʌ	÷	ˋʌ	÷	ˋʌ	÷	ˋʌ	ྥ\nʉѕ	\nB	ˋʌ	৑ɀ^˗	˗ʌ4ʡ̏ʌʤʒĘʌూɁ^ʡǁʌ¼ʌսɂ	Ʈ'ฒ	ʡǁʌ¼ʌ௏ʡġʌ	ȆʡġʌHƢϪ'ͷˌʌʌÙʌսƣϪ'ͷʡġʌȆʡġʌHɃ		ʡÏʌÓ	,ʉ͈ܤˌʌ¼	ˌʌ	ޯɄ		ʡÏʌÓ	,ʉ͈ෲˌʌ¼	ˌʌ	ੈƤF̧̨̩̨̩̪̨ŏıŅĚ̩̧̩ʡ֪	ʡീ\nF̭	\n̭Æ>ʉƾ0̭ʌŨď¤E»̭ʌŨďʉTEʉ৊̭ʌŨďʉķEೌm̭ʌ!ĴďI̭ ď6̭ʌî¼ඐ̭ʌ$༥̭ʌങ	̭ʌŦʉÌ\n	<	8̭̭ʌʉÌÞď\nď\rďƂ\nƒݣِ̭̪	6E๺̪ƂŏııౠŅŅҥ	̪ƒŏıǤıڏŅŅҥ	Ƈ	EmjÜ Ņ9ʉЈ ı҆ Ņ%ʉƉ̫	\n\r	/\nʌv¢\r\r\n\rt\rĤqŅ၅ıŅ۳9ʉ೼	ʌ$҆%ʉʳۘʉ৹%ʉʳʉঅu	ʌԆ௢ʉ೾࿀̧\"Ө	̬	\n\r	/\nʌv\r¢t\r઩ʉ૟\r၏1\r	\n\nƒ\n\nƂ\rॢ\nE̦	ʌ$\nE\n෍		^̫̩H\n^̬̨ƈɅ	\n\r\n<8\rʉуʉſ0\n\nҶqʉǹ\"ʉǌʉǻ\r	ņ1ʉȿʉŶ\r\rƱʉŶҶ\nqʉǹ\n\"ʉǌʉǻ\n\r	լ\"ʉӚʉоʉȿʉĒʌ$\nHɆш̱<ɲ఺ɇ	\n\rȝ	ʡúʌĀʉ˲//\rʉूʌǗʉ˲ȝȶʉʳʌບ\n\n	\n0ʌ$ȝʌ\n:ʉr\n:ʉ̈ʉၒʌ	:ʉࢃ\n\n\r\n0ʌ$\rʌ$ȝ೨\n\nʌ!\n0ɅɆ\nʌʌÙʉථȞĸڙ7Ɉ	\n\r	5ʇʌÙʉ˲\nȝȝ<8ʌڵʉуʉZƪʉု\r\rʉే\rBЄqʉǹ\"ʉǌʉǻ\rլ\"ʉӚʉоʉȿʉŶ%ƱʉŶЄqʉǹ\"ʉǌʉǻ\rņ1ʉȿʉĒ	\n\"ʉåʉ3	\n\"ʉÅʉ3	\n\"ʉ½ʉ3	\nƱʉ3	\n\"ʉåʉ3	\n\"ʉÅʉ3	\n\"ʉ½ʉ3	\nƱʉ3įഇ	\nď	ʌî\n%ø	ƥF̧̨̧ւ̨ւˣш̧̨̗ɉ	\n\r\nʌǗʉಧ\nʡˍ©ȝ\n3ʌvóʌɃÆʉӝ\rʉऐ0ď³າ,ʉ຅³,ʉ঎aʉԁʉƎ\"ʉÚʉȩʉϬ\"ʉÍʉȩʉȜ1ʉȼ³ƳqʉȜaʉƎqʉ{͌\"ʉԚʉཉ%Ȓm\r\rïٰ\r1ʉǑ%ʉ݀Iʉĳ\rʉȞ\r\r	ȶaʉླ	ɱ\"ʉÚʉѤ	Ң\"ʉÍʉѤ	д1ʉཎßɊ	\n\r\n3	3/Æʉ0ņ͌\"ʉԚʉমm\rૌ\n\rE\r໢࢒ਠ౸qʉϚqʉܸqʉ?\"ʉȜ1ʉ༧ʉ¨\n\r\r\r͜ʉ0\n˶m\r\rʉ\rt\n\r\rళ:ʉߞ:ʉ၎:ʉͺ\r:ʉິҽʉͺ:ʉ྇ʉ0y\rqʉƎaʉr	yqʉƎaʉྫྷʉÀ0yʌɃ		yʌಏɋ	\n\r	̱<\r		ʉ൙8˨L	ύʉֆQʌĀʉേʉOʉ?ଐ\n<\n8\nL\nQ\nͻ0aʉȑ\r\"ʉÚʉ·\"ʉÍʉ·1ʉ·\raʉȑ\"ʉÚʉ·\"ʉÍʉ·1ʉ·aʉȑ\"ʉÚʉ·\"ʉÍʉ·\r1ʉ·\rʉʺaʉȑ\"ʉÚʉ·\r\"ʉÍʉ·1ʉ·\rʉၢʉ?\rmʉ0		ʉ٦aʉԁʉƎ\r\"ʉÚʉȩʉϬ\"ʉÍʉȩʉȜ1ʉ·į\r\r]Ɍօ̱ݯɲྯ˨ೠੑໝɍβȵʉ˔ȵʉ˔ȵʉ˔ȵʉ޵Ɏ	̧̨̩	ˣ̧	<̨	ઃ̧࿸̧ఢɊ̧̨©̩ɉ̧̨Ĕ\n	\n\r	ʡúʌĀʉஃ/\rʉଃʌǗʉƅ	ɍȠʌɃʌǖ\rm\nʌ!\nƠ\n#\rȝƋ\n\n	ƪʌ\nqʉσ\nřʉÌ	Ɍ4ɋ̩¼̧Ƌʌ!0ʌ$ဲȞH	\n\r/ȝRʌŦʉȬʌʉঽ	ʌĀʉภ\n\n	ƪ\rʌ\nqʉσ\nřʉÌɋ̩\rş̨	Ɍ̚ʌ!0ʌ$Ĳ\rpȞʌ಴ʌŦʌÙĸǕ\nǊ]ɏӖƨł_ʌஂƄ৯ŅӢɐF5ɏɛਤ0ƛཤ˾ŐÕʌŦʉկɑ৔ɏྐྵƛȖŐÑɒʡʑ~Ƚĸɧ7ɓ^ʡʑßɔ^ʲȽʡʑఅư6(Þ_ѷ˨̧Ņ̃F̨̩̨̩ˎ˧˦Ĕ̪FΓޡʡˍħʌŦʉկ	Ʈ࣭ʌʎൕRȸ	ȠʌŦʉҰʌʉȬȔʴ	RɈ̪ŮȽʮʌɇ\rʌಫծ_ʌӗȚ̨య\nŔ̫F	\n	Γࡐ\nj̨B̨\n<_ʉǑ\nJʉ̓Ό		\në̬˧̬˦̩ࡼ̬	ʀR	Ȱ	ʌØʉϵ	ȿ		ɇ	̪Ů	ȟȔ	χʌӃ	ʌ¶ʎzȷ	࣯\n੧/%	Ɗ	\n\n=ʉǑ\nΓ಑̨ਚ\n	ƀ̩Jʉϵ̩Ľ˄̫೩	̨~CߛΌΓඑ೦ɕ˨˨%Hɖ	˨	࿫˨/	HƱ	\nm\n\n	\n0\nƑ\nßɗ	\nɃʌǇ	<\nқɃ	ʌࣨŮ<?қ'\n˜ɘŮ?	ʌǒ?'	ʌ໺'ǅə	čʍǜʍãʔŋʒ෇		ʌ!	Ĵɂ	།ɚɃɃʌʭʌඪʡʓʌʌъˌʌ¼઒Ʋ\rʌǒ]Ƴ^ɃɃʌʭʌಕኗ7ƴ	\n	/ʌƔʌŲʌఇ\n\nʌ!\nชɁ\nà	ʌ$\nѨ	ʌၟʌ਻ɛɃɃʌʭʌ੭ɜ^Ʉʌ঑Ƶ^ɜʴɜHƻ̧̨̩̪̫̬̭̮̯̰̱̲̳̴̵̶̷̸̹̺̻̼̽̾̿̀̧ǫ́̩ó̪̫ó̬ʉݡ̭ʉň̯ʉ̶̍/̸Γϣ̺̼̽̾̸̀]Þ^¤P¤!_	H\nSѷ	Fɒʉޑʌˀ̹\rʔ࿖\n̴́̬̵́̭̲͋̳5͌ʉŲ̰ɔʉܕ̱ȑÕʌӋȗˍʍрȗˍʌœȗˍʍ`	ȗˍʌаʑǢ\nȗˍʌаʏ¯ȗˍʌĪȗˍȏ\rȗʵʓ̊Ĕ6͑৽H6͑ơH	6͑ʉOH\n6͑ʉNH6͑ʉ?H6͑ʉWH\r6͑ʉTH6̰R͓ಢ͍ʉာ͏ʌࡑ͕ى̲,ʽ͒ͅ̩̮R̮=̮%၌́͗͘͙͚	͗͘͙͚/	Ŝ\nǇǛș\rŸğ,ĹőŽȰ%]\n͙ࣗɅ͗_͘H͙_͘FՃǇզ͚͘͘͘Ʌ͗ȓ\rFՃǇզ͙͙Ԝ͗ư͗͚͙ѨДŜظǛȠ͚͙͙͙Ʌ͗ά͙%͘\r͗ư͗͘͙Ӣ͘͙ˆɅ͗ˆԜ͗ư͗^͚̗͂	\nm\n\nĉ\nB\n	̓_ʽ&_ʽ๘ގѮো৥̈́^ˈĠĖচĖƺċ෷ċໄͅ^ʡĊĖ௘ʡĊċߎ͆		ńʂŊɰˈĠńƺŊӤˈĠńƺŊԘʡĊ	ԛ	ʲ	ȓʨ	H͇	\n	ńʂŊɰˈĠńƺŊӤˈĠńƺŊԘʡĊ	ԛ	ʲ	©\nʨ	இ\nʉǩ˂ஶ\nǅ\n͈	\n\r/	5͎ʹ\n܃>ʌ!0\r5͎Ė\nǝċ\nǣʌ$͇\r	ǡ\n]͉F͗͘͙͚͛͜͝͗/͛/͜/͝/ƿũ	ǚ\nƻƖ\rƊƾŏǍǤ]	͘͚͙͜/͝/͗/͛Æ	Ĺ(	Jő(	Ž	ద	JĹྦྷ͗͘ͅ%	͘ï͝ʌ$%	ึ̓%	౗͛͚̈́%	͛͚ţʉڃ͙͛͚͚แ%	͜ʌ$ƈ	β͙͚ß\n	\nʉT	/\n͂	ڥ͚ĉB͛IʉŌ	ඈIʉӗ	ຣIʉළ	౹Iʉݔ	ฤIʉਕ	ຏ	བྷĉB	ತ\nۯ\n	\n\rʉâ	\n\rĢ͘	Ɛ͘ฑ//\nဦ͘୭6͗͗~ࣂ=ʉݩਨ༕ʉ౞%șэҲ\nŭևଡʉࡖ̠Ȳ0ЀșэҲŭևmjBȕʌØʉ໇ರ\n=	\r\r\n	ʥ\r	٠		\n\rĽ\rˎĢ͜ʌØʉກ͝ʌ׃఻͝ʌût	͝\n͝২̓	\nŇࢭ	־\nד	ċ\nɰ	Ė\n࡙ʉ঄ʉঃʉ൝ªʉܻʉ࿿ʉၓ=ʉ੗ʉே	ċ\nܛʉਖ਼ʉၖʌ$ຍʌØʉ؞ʌНʍ༻¢ʌ!0E+ʌv¢ʌ!0ʡĊĦऔ+ʌݽ+ʌǖ¡ʉO=ʉసʄ\rި\rມ௭ʉଞ\r	\n\rʉ¹	Ľ\nĽĽख͜ʌØ6\ró¢>͜ʌû0͜͜ࠄǝ	JR\rČ=ʉŌ\n		4ČࣄϞJR\rČ=ʉŌ4Č=ʉ̓\nJ	R\n	\rࣇ=ʉ̓JR\rڙ\r͜ʌÙʉນF	\r/	Ģ͜ʌ࿎ʉ࢖ʌ٧\n%=Ȏࢁ%=Ȏൈʉਹ͈͜\n<ྜྷʉZʌ!0\r\nު2\rRČ	=ʉ̭࿯	݈	Č\rίʌٽ	\n\r	ʉݛ\n͜ʲ	:ʌ༇ʽĢʉฆʌû9ʌÙܪB5͎࢐ષߌ୍JʽR͆ʥࣥĜ%ǵ෵ʉ؅ȇ௕	\n\nঌJ̧Շğࡲ	ʌψ̓%ĹŮ	à\n׮\nF	\n\r͜<5͎ʹ	ʽ\n¢\r>\r͜ʌû\r0͜\rͅ໤5͎Ėǝċǣ\n͇	2ʽ\n2		љČ	\nಎß	\n\r	\nۍ̀ş	̀ş5͎͜ར͜ഹ̀ƽ	̀ƽ̀ş͜ʌΟ\r\r\r0͜\r	ɉĖ̀şˤ\nɉċ̀şǣ̈́̀ƽί	\n̗͊F͗͘͙͗/͘͙ƿũ	Ǣ\nů]	͘͙¢Ĺ(Jő(ŽƯ	%	ʌ£ʉா	ʌ£ʉำ͗͘	͘ф	ʌ£ʉ̭͙໳	͙\n	\n\rʉ°	ʉԔ\nȁ/\rĢࠣ͘͘ĉB͗ʌ£ʉַ\n̦ʌن\nʌهф\n̚ĉBţ	\rڭ\r	\n	ٳ\n\n͘ĉ\n\n6͗\n~ʌ£ʉߋʌ£ʉথʌ஍ʌॿ	ࡰ͗\nѠ	Ê͋F͗͘͙͚͗͉͘͊͙͚ʍڼ]	\n\r\nڀ_̨Сj͗B͗ʌΡʋ͗²̴	2ʽR\n͙ϝ̴,ອj͘B͘ʌΡʋ\r͘²̵\r2ʽR\n\r͚ϝ̵,৉\nÊ͌͗͘͙͗͘́͙́Ǹ	ȏ\nɎǴ]		ࣱ_̨R͘Ÿ	͗ŭ͙Ÿ	ߧǴÑ\n_ʽ]^ʲ:ʉݲȎഽF	\n\r !\"#$%&'()*+	\n\r̯ ̯!͘ğ\"͙ğž!έ#͘Ĺ(#J͘ő(#͘Ž#Ư$͘%#%$ũ	%<%8ʥ$ǚʥ$ƻ$ƖJʽR&$Ɩ&ݱČ&8&<	љʉҨ+ʉҨ+஗'$Ɗ'<'8($Ǎ(<(8)$Ǥ)<)8)L)Q\rʥ$ƾ\r$ŏJʽ	_̯	$ŏ$ŏëuʡú+:ʉѣuʡú+:ʉѣ=ʉैĜ+Ӂʉ࠳ʉÔĜ+ӁʉॴʉĆ%ʉଫʉlʡŷ:ʉŲʡŷ:ʉŲʡŷ:ʉ೏Ģ\"έ#͙Ĺ(#J͙ő(#͙Ž#Ư*͙%#\n*ũ*Ǣ*ůJʽ	 ,̯	 *ů  *ůë_̯	ʄ _̯	 ʄ#̮Γॊ+	+ܒ 	+Ãʉব̮T+̮9ʡŷ	ǡ̮9̮9͗̮9̮9̮9̮9̮9̮9\r̮9\n̮9̮T̮8Щ̮8Щ̮8ں͍	্ʌߏືʎঐʎ௧ʌؾ	෴ʌ਒ʌဝȁԺȁജʌ৖ʌ఑͎ဉྒ͏^Γĝ̾͐༡ʌث͑		5͍͏ʌ೻̰	͓	୛͐	ࡀ̿_̨	͒̨©̵Ÿ	̿̩̵Ŝ͒͒̩ב̽໹	ʌщ̴Ÿ	4	ʌఖ͒̨̧		ʌс̪	̽ʉಲ̼̽ʉߡ	ʌ£ʉ࢛̻	̽၀	ʌ£ʉྨ̓̻	à͒̨©̽ம	ʌ£ʉŌ̽Ţ	ʌψ	ʌс̫R̽ʉN̼޳	ʌщ̼ࢰ̼̼9ʉŌ̽ණ̿̨Ê͒	\nčʎ๱ʐଉ_̨	̴ğס̵ğǧ\n̲ʍԊ	̳Ǹ\n੔͓/ʌ$ʌॉʌܵʌ$ˤʌ$৶ʌ$ˤʌ$ǣʌ$ʌ״ʌ$ʌಡʌ$ʌي̶ʌ$ʡÖʌऱ̶ʌ૾Γĝ̸9ʉݬ͕ը͔F	č\rčɒʉ݊		ʌ!	ࠥ		ஞ\n6	౛ʡÖʌʌ߅ȷɑ֚FñʵǾҁʵǾ̩ʐဨʵʍՂʉ֔ʡÖʌَʼÑ\r༃ʦÕʌ෌ʵʌ໷ʵʌʠʌદʵʌʠʌး͕Fݏ̷	̷͔Ƞ̺ïʌ$̷ʌ$̺ʌ$̱ʌӃ̶̶/̸Γϣ͖ʡÖʌ௙͖ȁʵʌ༸5ʵʌ׺ʵʌཱུ5ʵʌཽʍൾ̦ʌʶʍf̹෸ʌ͉ඃɝ	\nຓ&ʌԢ̖Ե	jB\n	၂\n		\n	ʌŐ\n	ɝ\n4\n]ɞ	̖Ե	jB		Βǀ̧̨̩̪̨/̩ȁ̪ݖ.¡̫ÒƊ̫̨ʌಗ̧@̨̨/̪؁	ñʉಐ46	0ڇ̩Ü̩9	6̨ʌН̪ȁ̩໭	%̩=̠	̫์̪&̪č2č&̪ĝ2ĝR̨ʌ$̪̩	ಳ̪ɞ̪࠿0̪0\r0¡ʉǪ̨ʌ༞̪̩̪0ƈ̨Êɟ	\n	č%č\nĝ%ĝ]̍	:	\r\n:\nHɠ	\n	ɟ\n0%0]\nu	+\nဵɡ	\n\r\n[čč%čĝĝ%ĝƘ[č	č%čĝ	ĝ%ĝƘ̍\nč:\nč\r\nĝ:\nĝ\r̍č:č\rĝ:ĝڱԩ\rՇ\nč:č\r\nĝ:ĝǵ:\r̎ʉ̍̏ơဧ̐ݧʉൗ̑Hɢ	\n\r\n[čč%čĝĝ%ĝƘ[č	č%čĝ	ĝ%ĝƘ\nč:ĝ%\nĝ:č\rɡ	u\rʉୀ\r\rʉ֏\rpʷ7ɣ	\nĢʌຫ	>	ʌ!	0\n	Ħ	ď\n:\nҩʌ߶ɤ	\n\r	/\n/&ʉɚ>ʌ!0%\r\rªƣ\r9ʌǕ\rʌѫɠ\rȪ	ʌ$\nʌ$\r 0ȏ	\nßɥ		ɤøɧ	<	ѭɦ	\n/	/\nʉෛ>ʌ!0ɟďԕ\nʌ$	ʌ$\n:øɧ	Hɧ	\n\r	/\n<ʉNʌØʉϗ௉ʌØʉலʉϤʉNʉݙ\r̏ʌʰƋʌ!0Ħ\n¡ʉɨ	๎Ħ\r̃\rʉƁ	ɨ	\n6ʌŨNʉd4&ʉŰ0č	ĝ\nǖʏއɩ	¢	>	ʌ!	0ɟ		഼ɪ	\n	ɥ\nɳ	\nȁɩ	ø\nɫ૖ŵŵDDĭĭ\rĭĊĊ\rĊĪĪ\rĪ˜ɬ	\n\r	/\n<̏ʌʰƋʌ!0\rĦ\n¡ʉSɨ	\rĦ\rʉƁ	ɭ	\n/	/\nÆʌ!0ʌ$ č	ʌ$ ĝ\nʌ$ 0ȏ	\nßɮ	\n\rɭ	<\n8Lɬ	\rɬ\nȏɳɳ\rܢӡ7ɯ	\n\r	/\n//&ʉɚ>ʌ!0\r%\r\r\rª\rƣ9ʌǕʌѫ\r0%0ǧč%č¡ǧĝ%ĝ¡	ʌ$\nʌ$ʌ$0ȏ	\nßɰ	\n	ɯ\n	<	8	ࡗɳɧ\nǡɳɧকɱ	\n\rൻʌ੫ĭĊĪŵD	P\nȎɛ\r\rʌ!\r0\r Ģ9ʉཀྵIʉඇIʉژ9ʉଋʉྦ=ʉਘ=ʉॅʉޅ\nԱʡÝ%Ȏ౅\r DͦʉɴɣʍІցĭĊ+ʌΜʉֳĪ\n+ʌvŵD	Ɗ^ĢÊɲ̧̨	\nņ̃ʌݻʉג/̨سৎ̨̧ʌम̧̨~č,čĝ,ĝB̨॓࿋	̧<\n	ͼ\nဴ\nͼҸɢ	\n¡ʉґʌŨĢD0%	0ढ़	\n\n˳ɳ	\nɲ	ɩ\nʌԿ0%Խ0]ɱ\nuʉɴ	+\n\nHɴɵဤƷǤǶ\rǏ¡ʌ࠷ɵ	\nÆ	>	ʌ!	0\nɟ	ď	Ȫʌ$\nɶʉ஽ɷɶʉ໓ɶ	\n\r	/\n̉+ʉઉʌ!t\r%\n\r\n\rª\rƣ=ʌǕʌЎ\r0E	ʌ$Ԧ%\r٪	ɷ	\n\r/	<\nó¢\r>\rʌ!\r0\r,		Ա=	า\nRʌ$\rȤ\nóઽ		\nRʌ$\rȤ\n஺	ဟȲǶǏ˜ɸ	\n\r<	\nߍ>ʌ!0\r\r0%0=ʉร	ï=\n	\n঺ï\r]̏ĠʌÙ	¡ʉ¸ʉࠦ̏\n+ʉ¸ʉ฻ǁ	\n\r\nɩʌԿ0%Խ0\ruʉɴ\n+\r\r=ʉࡨʉࡦ\r	uʌĀ	ɪʉƍɪʉǇɳɴɮ<8ɰʉƍ<8ɰʉǇ<8ɳɦցǆƣɫĢƼȅǓčĝǮƺǷƳȥʌØʉϗʉࢩʌvŵ\rDȁ\nŤ0Kɸॺɹ	ñʌŐ੹Ü̖ʞʍІɹ҇̠	jBʌٟ	ࡥʌǞ		ɹ	˾˳pᔽ7ʄF̧̨̧/̨ྩŘŔƊಥ̨ਣ̧ ̨ß6ब̧̨#Êʅ̧̨̩̩̧ഓĤƑ̪&Ʈ	Ǒ\nƊ̪̧̨́۠̨F̪žஔ̧֊̨̨]	Fł&žఀʪܟ\n	̧̩ę̏Æ	̨̩	0	̪͡ÊǊ̧̨̩̪̫̬̭̮5ʦ້	̬֣̮̭Ǒ\nĔ		̰̱\n	ໆ	ǳඦڕ	ǳຮ̭ʅ̰̭Ƒ̱̭&\n̱	Ɣ̧	Ǫ̩	ƭ̨	Ʋ̭Ʈ೛̭ƮŮ	ǜ̰	ƞ̰	Á̲͡	̲F	\nú̰ƥ̰ç̱	̰\n5ʇ	৲	0\nՄ̲(	̰5ʇ	Ƌ	0̲(ô\nȆ]Ê̯੷ುဩࢅ໑<کࣜ<8۶ཅ<8L٣඙<8LQࢯऩ<8LQ3֑ਜ<8LQ3g௩ฺ<8LQ3gęɀ\n̰̱	\n̲\r̳Á̰Ɣ̱ƭ	Ǫ\nƲ̲ʄɛ	đ0̴	Ȫ\rࣶ	ʤత\r֊\rت̳5ʇú̳Լʵ̳ǜʵ̳ƞ̬\n/٢ฟཞҖ̳۰̳ômћđ0̳̶ç̮ç̷¼çȅĔmđ0̴̴ۢ6ǰത̵ಞ̵	\n˭		đ	0\n́	\n༳	ଦ\n࿶	೵\nט	ཱȡ̶̹̺^F	\nñ̹ƥ̼̲Ř̲Ř΍̺8Ъ̺࿉/5ʇ̹ú΍ִ̺Ъ̺ୟȪ	̹ôm\nћ\n	đ\n0\n̶	\nĸଁҖೈࡹ̹çဥ̹ç̮̹ç©̷̹¼̹çȅ3g̹ƥR̲Ŕ̲Ŕ΂ధÊ̷	\n̹̺̻̼\r̽̾̿̀́͂̓̽ç̾\nL̿\nQ̀\n<́\n8͂̲Ř̓¢̹̹	̹t̽̹~ஊရࢎဿ̻̽-̹͂ ̓ƀR̹̻Ϡ̓͞Ϧ̻̽-̹̺̀4ด͂ ̓͂̓ࢆ̻̽-̹͂ ̓R̹̻Ϡ̓͞஥ຌ̓Ǽ̓̺̺̻̺͂͂͂ǚണ͂̓๻๷͂ ̓̺͂̓ď̺̰̽-̹Ҫ̼̽-̹̻̽-̹̺̿̼ࢨอ̽̹Ͷ̻̽-̹̱̻̽̹͂̓#4ຯ͂̓ऑͳ̽̹Ț̻̰̽-̹Ĥ̽̹̻̺͂ ̓յ͂ ̓͂ ̓਀͂̓#4ڷ͂ ̓\n༶\nԻ̹	4ఁ\nڲ̹	4ڣ̻̽-̹̺̳̼̽-̹͂̓#́̼y̽-̹ය੍്ڨн͂ ̓͂̓#4܉͂̓஀ۄ̓ȱ̓̺̺̻͂̓#̺͂͂Ǚ͂̓#̀̽-̹˸٩ဎ̓Ż̓̺̻²͂Ǫટ̓ȱ̓͂̓#̺̻²͂͂Ǚ࿾͂ ̓͂ ̓È͂̓#͂ ̓̺͂̓ď̺̪̽-̹Ҫ4ॸ࿬͂ ̓͂ ̓̀͂̓#4ઐ͂ ̓͂ ̓Ȃ͂̓#4ਯ͂̓౉͂ ̓͂ ̓́͂̓#4ထ̓ȱ̓̺̺̻̺͂͂Ǚભ͂ ̓͂ ̓՞͂̓#4၇\r̽-̹̹\r̽̹О̻̪̽-̹Ĥ̽̹̻͂ ̓͂̓#̻ইെଌ͂̓#̳̽-̹˸ो̓Ż̓̺̺̻͂̓#̺͂Ǫ໩͂̓#̾̽-̹਑̺̺̻͂̓#̺྿༊๤͂ ̓̺̻ɡ4व͂ ̓͂ ̓๦͂̓#4ะ͂̓#̽-̹Ȕ͂̓੩೑༉͂ ̓̺̻4ࠀ͂ ̓̺͂ ̓͂̓#̺༂̺̺̻̺ဌ̻̽-̹͂̓#̶Ȇ̻\nƇऊ̺̻ླྀু̓Ż̓͂̓#̺̻²͂Ǫ໱\r̽-̹͂ț̓%\r̓̓\r͂̓#̯̺̻ѳ̓ȱ̓̺̻²͂͂Ǚଗࢂ͂ ̓̺͂̓ď̺\nƇশ͂̓#̺഻̻਷̼̽-̹͂̓#̿̼y̽-̹ဋ̻͂ ̓̺͂ ̓נӳ̽̹Ț̻̪̽-̹Ĥ̽̹̻̺͂ ̓࠻͂ ̓͂ ̓Ħ͂̓#4ඊ͂ ̓\r̽-̹ʤ̹\r̓Ż̓̺̺̻̺͂Ǫ޷ਙ\r̽-̹̹\r4ࡊ͂ ̓͂ ̓ţ͂̓#4Ӱ̻̽-̹̺̬4͂̓#̬̽-̹˸ల̽̹Ͷ̻̽-̹̰̻̽̹͂̓#4۝͂ ̓͂ ̓Ϙ͂̓#4న̻̽-̹̺̾̸̽-̹̽-̹\r̽-̹̽-̹̹݆̾\n\nȵ̹	̹\rʇ૜౼ర͂ ̓̺̻͂̓#4ە̓Ǽ̓̺̺̻͂̓#̺͂͂͂ǚ౒͂ ̓̻̽-̹̺̫̻\r̺\r_ʽ	\r̽-̹ၜ̹̹\r̻̽-̹͂̓#̻ˏེచ͂ ̓͂ ̓Ȓ͂̓#4ہ͂ ̓̺̻շ4ૅ͂ ̓͂ ̓ҽ͂̓#͂ ̓̺̻Ƒʇએߣ̼̽-̹̻̽-̹̺́̼ˏؖ̺̻ږޭ͂ ̓͂ ̓˓͂̓#҇\r̽-̹͂ ̓̹ਆ̼j6̺̻̼̷̹̹\r\r\nÓ\nٌ̹	ة̹\rٕߖ̓ș̓͂̓#̺̻²͂͂͂Ķ͂हഎ̻̽-̹̻ˏၕ͂̓ඕ̺̻ތठټߕ͂ ̓͂ ̓š͂̓#4ക̓ș̓̺̺̻͂̓#̺͂͂͂Ķ͂ωߐ̻̽-̹͂ ̓ƀ	̹̻௔͂ ̓̺̻Ѳʇஸ౲͂ ̓࡭п̓̺͂̻̓4੏̽-̹Ȕ͂̺̓ࣿ̻ۇݝ࿕͂ ̓͂ ̓੖͂̓#4ধɟ̺̻Ȕٔ͂ ̓͂ ̓޿͂̓#̓Ǽ̓͂̓#̺̻²͂͂͂ǚך͂ ̓̺͂ ̓̺୏͂ ̓̺̻ྲྀ4ย͂̓#̺̻ߴ͂ ̓͂ ̓һ͂̓#޴၄൞ی̓͂̓#ʽ4ୄԂ͂ ̓͂̓#4خ͂ ̓͂̓ࡷ̽̹О̻̰̽-̹Ĥ̽̹̻͂ ̓͂̓#̻ත๬̓ș̓̺̺̻̺͂͂͂Ķ͂ωษ͂ ̓͂ ̓́4ࣩ͂ ̓͂ ̓૯͂̓#̓Ǽ̓̺̻²͂͂͂ǚန൵଒̺̻Ȕฉ̻̽-̹͂ ̓̻࢜\r̽-̹͂ț̓%\r̓̓\r̯̺̻ѳ\r̽-̹̓\r͂ț̓̓\r\r̺̻࡮̺Ƈࢊ̻̽-̹͂ ̓͂̓#̻૕̓Ӽ̓̺̻²͂͂͂Ķ͂˰͂ч୾̺̻၆͂ ̓͂ ̓૰͂̓#4ׅਥ̓Ӽ̓͂̓#̺̻²͂͂͂Ķ͂˰͂чྒྷ̻̽-̹̺͂ ̓৻͂ ̓͂̓#̺̻շ͂ ̓͂ ̓ȕ͂̓#4੎͂ ̓͂ ̓Ͽ͂̓#̓ș̓̺̻²͂͂͂Ķ͂୘̲Ŕ͂ĔF̽-̹ྤϦ̻̽-̹̺̀4ृ̼̽-̹̻̽-̹̺̿̼ͳ̽̹Ț̻̰̽-̹Ĥ̽̹̻̺͂ ̓յ̻̽-̹̺̳4൲࠶̻͂ ̓̺͂ ̓ӳ̽̹Ț̻̪̽-̹Ĥ̽̹̻̺͂ ̓Ӱ̻̽-̹̺̬̻̽-̹̺̾4૘̼̽-̹̻̽-̹̺́̼п̓̺͂̻̓̻̽-̹̺͂ ̓೔̸	\n\r\n		ʀ̷ě6\r̷\r	ҳg3࿺	̷\r\n฿༜ԻർǋӖƛȦŐȦ_čʉཌʉ੅ʉࠪʉॽʉখEčʉ့ʉ࣮ʉൡʉइŌ		ȥ,ʌȎȿ̚ʌ!݄Ƅʌ$Ĳ	łƄȦŅʌҞ	ʌ̢ʉ՗Ōȝ	ʌλʉषF	\n\r	łƄ\nłƨʌw	ʌ$ʉ༹	ʌǖʉǩʉ1ʉτ0	ʌ֖	˓ʉ՗Ōȝ	ʌλʉ޾	ȝ		ʌ$ʡ੸Ņ:ʉ೽ʉࣖ	ʌ๧Ņ:ʉමŌ	\nʌv5ʇ:ʉ॰Ơ\r\nį\raʉåʉ3\raʉÅʉ3\raʉ½ʉ3#\r1ʉƏ		\n\rʌɃłƨʌĕ\n<8L\rQͻIʉบ09ʉෞ%ʉֆ%ʉၣ%ʉျ%ʉউǸྡྷaʉ२\nqʉޥ\naʉઓIʉ୮1္1\r4Iʉ൛\rIʉတ1֋1\r֋1\r4Iʉธ\r	\r\r\rߑE˂²+ʉಖ\r\rqʉୂaʉÌ\n\n	඘༓\nȋ฀ΏȋೂఉȋۏЭ\rȋ೉༟ಚǌ̧̨̩̪̫̬̭̮ਝ̨̧ʌ৫̩̧ʌɣ̪̧ʌँ̫̧ʒ૎̬̧ʍౕ̭̧ʌױ̧ʓށ̧ʑਫ਼̧ʒ౨n̮େʉ୨̧ʌ྘̧ۤ̷ʍΥ̩2ʽ	̧ʌ҃໼	nȗ̧ʍϨĸ˥\n\nДƹ&̮ȦŇသ\nʌæʌ঴\nʌæʌଂ\r̯̺̻̼̽̾̿	\n̿ࢶ̽̽ɺ̽Ƴ̿Ňɕ̰̺̻̿Ňɏ̱̺̻̿Ňǥ̲̺̻̿ŇȨ̳̺̻̿Ňȼ̴̺̻̵ʌ̿̺̻΂̻2ʽༀC̭C̿ŇŖ,ʽ&̿ŇŖྣ̽ࢮ̿ƹʔఏ˄\rʉ෫̿Ň	/\n̿Ň̠jBཻਐϘʽ		˶	੝ʽύ	ࡄj	B	̀\nR\n	࠙2ʽC̾,ʽ&̾ٱ̿ʌȇ̺င̼,ʌ਺̼ࣔ\r̯ʌ̿̺̻̼̽̾ƈ̰Ԯ2ʽB̩̶̩Ȅ̷̩ě	Ṟ́̬Ͳ2ʽB̬ʌ¶Ȅ̬ʌě	Ŕ̲	ñ̫஫	̸ž2ʽB̫	y໏̫	yࡧ\nŔ̳̪Ͳ2ʽB̪ʌ¶Ȅ̪ʌě	Ŕ̴	Ʈʡඛ	̹ʌіʌཾ	ʎज	ʌɬʒ൱ʑש2ʽ̼	ʍU	ʏত૫	ʍམø	ʌ̳ؤ\nŔ̵̺̻̼̼ڶ̭Ró̭ʌʶʌĄʌੜ\nʒૺ̻2ʽ	ʌǐʌǐ\rڰ	Ӊ\nӉ	ʌʈʌ՘	ʔ֨ʌྌʌ܈	\nʌʈʌ՘ʍϴʍΔʌډ	ʎՐʌࢻʑ౭\n	ʎЕʌθ\nʑࠋ̺෾̻ݓʌੵ\r	\n̽ʌʈʌڪʍϴʍΔʌఞ̼ŇŖʽǤ	ʎՐʌ܀\n	ʎЕʌθ̽\nʌǴ̺̽ʌǐʌ೿6̽ʌ࠭ʽ	̼ŇŖʽ̼ŇŖ̽ʌཷʒ୬̶	\n\r	̧ʍཟ	ÓʡÏʌʌŘ\rʌҟʉùʡÏʌ\rʌྂ\nʡÏʌʌŘ\rʌఌ\n,ʉ̌\nʡÏʌ\rʌ८ʡÏʌʌ°\nํ\rˌʌ¼\n2ʉ̌\r\rˌʌ͵\n౱ʌŘ\rʌ̉	\r\rʌŘ\rʌ̉	]࣪\rʌŘ\rʌ̉	̷	\n඀2ʌ໊	\rʌáʡƧʌʤʏ൘\n\nʌ!\nt\n֡ʡūʌિʡмʌşʌೇʡÏʌ	ॻ̧ʎαʡмʌ	ʌvʌ੤̸ʡ̏ʌ̧ʌ߼ʍ՟ʤʔࣆ̹	\n2ʽ̨ʌǃà\n̨ʌǃ4\n̨ʌΪ\nʌɬʍ๳ʌ3\nʌɬʎथʍË	\nʍဣ©		̨ʌഔʌ๵\nȓ\n̩̶̩ʍΥ̧ʌ؎̧ʌ̩҃	\n6̯ʌԇʽʽ	\nH\r6̯ʌԇʽӮſ\x00ʡӷˇʌ̧\x00ʡ̿ʌƟ\x00ʵޝ\x00Ǭ˩ʌɿ\x00Ǭʲ˂\x00ǦʵʔҺ\x00ʵʌ̛\x00ʡǓǰʍʆ\x00˩ʵʐζ\x00Γੲ\x00ǬKʡࠡʡปʼbˊ\x00ʡഞ\x00ʡʖʡ݁\x00ʡϳˍʌ̣\x00Ǭːʡļ\x00ǬĈʡഺˑ&ʡރʡŖ\x00Ǭ˒&ʡƽ\x00ˈ˂ʎ̾\x00˱ʵʎՀ\x00ʡ࿲\x00Ǭʣ'ˁ\x00ʆറʇಉ\x00ǬǩʌЂ\x00ʤǰʍȹ\x00ǬʢDˉ\x00ʧඥ\x00ǬĈʡ߳ʦ&ʭbʡƂ\x00ʡ༌ʵʌࠇ\x00Ǭʨsˁʡࡱʳ)\x00ʼʌ§\x00ˍʵʌǛ\x00˫ʵʏ৤\x00ʈʆ޹\x00˰ʵʏ֙\x00̐ǦʎΚ\x00̇ʵʎ߸	\x00ʡനǡʌæʌʪǬ	ǫ֒\x00˳ʵʎ̧\x00ʡဠˇʌչ\x00ʡԭ˭ʌ੶\x00ǬʡഀʡڔʡΠˌ)\x00ʡΊǰʍ˿\x00˯ʵʍȃ\x00ʨ˂ʎΚ\x00Ǩʵʌй\x00ǬʫDˁ\x00ʡణ\x00Ǭˎ&ˏǬ	ǫŉ\r\x00ʵʌྟǑउǒतǓ෥ǔP\x00̅ʵʍ̒\x00Ǭʡ୥ʱ\x00ʡ࣋Ǧʌϡ\x00Ǭʷˉsʡղʤ)\x00Γֶ\x00Ǭʵʳ\x00˵ʵʑ৴\x00˽ʵʍŸ\x00ˁړ\x00ʡΛʨ\x00ʦǰʍɐ\x00ǬKˇ˒Dːbʻ\x00Ǭˇʎɿ\x00ʤʵʔϊǬ	ǫȀ\x00ʮʱ\x00ǬµʺʡΠ˃Ĩǡ\x00ʡ෠ˇʌ޲Э\x00ʡ\nȄʽʵʐˍʎʉʌʑʏʒʤʍˊʔʓǡɔƗ˄ɁɖʲɕȔƇȗɒʪʦǠȁŗʼȑƕŀţĽƒ²ʰ˂˖ƅ¾˕ʮEƄƮǻƙȉƈ˘ʇŇȋƲƊɑȷƯƬņ˓ßÁL ƳƟbƏȴwŲ¼(ȜȅƑēȂ¢ȰŠȧËĠɂɟĸûƁăđŅCĬŵífęɛƱƢɄƋƔȳƨȸčtƧƦľƣƎǷĤȇȎų¸ÏèžōĜÚĔÀĵżö3HÎGĉŃÂŋĭ;ƉĊ¬Ƙl&ÑáêðǾő,Ò­ǅńƚƞƤDƛǁ0ƝƜY5°ƍɓƓȻƪ_ŕȾƽ¶ƖưȞƫXƠɗƹșƿɘȵƭƩƼƾƻƴǉɐƸƷďɀƶMůȒA¿ƌNĎƵâ/éſŖÖWúcĀrĕçļæÃÿu§ÅÛŹj6īŔýïÍŐ»ÄUķȊłSŧ%Ũ\r]!øĘüñǸŏ{ÇƀĿř¨<yÌmŬ\n9ě|ò±įeŞĦ`Ćŝ*ȌŜŭ·\\@÷ÙŮîġśFĖihÆıàűĈdģ¹óãÜzċ¦ä?)Īp\"IĹğĳā7³þT[ÝqŒūQĻŰĂŶćô#aźÕ$©ŊİĢsĝùJPœ}+£:¡ÊŚ¯1ŁõxºØ´=ĄOëŦĮŻ«Ég×ŷŎ~ìnƆŘȟÈĞȨoŽĒƂƃvʿĩȝĐƺ'Ěĥ^šĲȏ8Ķ ŉåŌÐǼRȀČŴVĨBĺşZŪ	½ť2ėÓ¥µ>®Kª4Ť.-Þ¤ǆÔȆkɩŸĴũŢǀħƐňąǄǂǃǇǈ\x00˚ʲ\x00ˈǰʍџ\x00ʡϳǰʍհ\x00ʡԼʉƶ\x00Ǭʡ࠲ʡූʡघ˒)\x00̕ǐ\x00Ǭʡзʡƨ\x00Ǭ̌\x00ʡеˇʍਓ\x00ǬKʡഛˆ'ʢʤ\x00ʡ͗˂ʌϡ\x00̂ʵĐí\x00Ǭˆˊ\x00Ǭʾ'ˋ\x00Ǭʡഐʡʘ\x00ʡ୯ʡਖ\x00̆ʵʌՅ\x00̟ǎ\x00ʴʌŧ\x00̌ǏǬ	ǫ૚\x00Ǭ˹ʌŸ\x00ʳֹ\x00Ǭ̕\x00ʷʌƨ	\x00ǣʇʌæʌն\x00ʡӘ˂ʎҘ\x00Ǭʡ࿗ʫ\x00̝̜ʌމ\x00ˊ୓\x00ǬʡຼʳGʡ࿽ʩ)\x00̘ǥʌˇ\x00ǬKʤCʻ&Ǡéʧ\x00ǬǢGʡ٥ǣ'ʩ)	\x00ΓĎˇʎĘǚ	\x00ʡΊʇʌæʌɈ\x00̚ǧʌռ\x00ʰʵʌ̬	\x00ˎˊʌæʌʪ\x00ǬµʧȻʡ૝ˊbʡƝ\x00ˏǰʍЯ\x00̍Ǧʎ̾\x00ʡγʵʌ̪\x00ˋˇʌݤ\x00ʥ˂ʍɢǬ	ǫྊ\x00Ǭ˒'ʡÀ\x00ơ(\x00ʡ๒˂ʎͨ\x00ǬĈʡဃˀ&ʡധǠ\x00ʡǓʌļ\x00ǬĈǠʱDʮéʡŖ\x00̛ǧʌ̾\x00ʡୢ˂ʏǛ\x00˒ʌʛ\x00̊Ǧʌ͢\x00ːௐ\x00ʡʖǰʍʆ\x00ˑෆǬ	ǫǷ\x00Ǭʬ&ˎ\x00ʡ̿ʌŴ\x00ǬˁsʤCʮʡͭ\x00ʦǰʍԓ\x00˄ʵʌՅ\x00Ǭʡࡒʨ\x00ǫ͂\x00˕ʵʌ૙˖ʵʍੇ˗ˇʌ஼\x00Ǭʱ&ʡࡤ\x00˂ǡ\x00ʡЮˇʌಭ\x00ǬĈʡ઱ʹ&ʡࠨ˓\x00Ǭˇʌေ\x00ǬʴDʡʘ\x00ǬʡӺˑGʡഠʦ)\x00ǬʾGʡΫ˓ʡ๽\x00̖˩ʌɿ\x00ǬʰǠʭĨʡƆ\x00ˌˇʌۀ\x00ɏʌ؈ǋ(\x00ǬʥDˌ\x00ƥ(\x00ʡທˇʌ҄\x00ˬʵʒˇ\x00̦ʉ൜\x00́ʵȄí\x00˂ʌÎ\x00Ǭʡҙʼ\x00Ǡ఼\x00ʷʩ\x00˓ʡƂ\x00˶ʵʒܫ\x00̒Ǧʌͫ\x00ǬʳˈCʹˑ)\x00ʣʌļ\x00ʡઠˇʌཛ\x00ʡޚʵʌУ	\x00ʡຬʦʌæʌʪ\x00̄ʵʌހ\x00ǬʰȻǡGʡෘʡݺ\x00̞̚&Ǎ\x00˷ʵʌ̪\x00˃ʌģ\x00ʫǰʍ˿\x00˪ʵʎζ\x00ʡܬʵʎҗ\x00ǬʼDʤ\x00ʡຕ\x00ʡਔʽ\x00̜ǧʌĺ\x00ǬʳGʡ̋ʨéʡ๓\x00˿ʵʌű\x00ǫŬ\x00˭ʵʐУ\x00ǤčʉÇʉąʉ@ʉӫ\x00ʦǰʍԅ\x00Ǭʡ຋ʡ৆˃bʡƷ\x00˺ʵʒӶ\x00Ǭ˄ʮGʷ&˒)\x00ǱȾ\x00ǡ༔\x00Ǭǧʎ੊-\x00̥̕ƠʉOƃǞǞǿǘ¤ĕŎņŎČਅƠʉNƃǟǞǿǘ¤ȷĕŎņŎČؙ\x00Ǭˬ\x00ʡఎǦʎҘ\x00ǬµʡෑʵDǡĨʺ\x00̙ǥʌɢ\x00Ǭʡູ\x00̢Γٺ\x00ǬǠGʼCʡ঵ʡঀ\x00ʺʌƨ\x00ʡ̿ˇʌЂ\x00Ǭʡ෭ʿ\x00ʮʤ\x00ʡγʦ\x00Ǭµʳʡࡺʡधʡŧ\x00Ǭʭ&ǣ\r\x00˜/˝/˞/˟/ˠ/ˡ¥\x00ǬʿGʡܝ˄&ʧ)\x00ʡӘǰʍջ\x00Ǭǡ&ʡÀ\x00ǧʵʓ҄\x00Ǭʡзʾ\x00˓ഗ	\x00ʡਲ਼˖˖ʌˇ\x00Γ×\x00ǬĈˀˈ&ʡࠩʡԠ\x00ʿʵʍʟ\x00̕˩ʓȃ\x00ʡഷˍʌߘ	\x00ΓĎǧʌňǘ\x00ʡ̐ˇʌШ\x00ʡ͗ǰʍࡉ\x00ʯʫ\x00̑Ǧய\x00ǬˊDʡƷ\x00̣Γ຺\x00̉Ǧʌԧ\x00ǲȾ\x00ʡ໴ʌƟ\x00ʡݨ\x00ʼ˂ʌ͢\x00̠ʉ਋\x00̎Ǧʍɢ\x00ʡӷʌ§\x00ʻׁ\x00ʣǰʍ଱Ǭ	ǫର	\x00ΓĎˇʌʼǜ\x00ʡࢫʢ\x00Ǭ\x00˙ê\x00ˇʪʌĺ\x00ʢ¥\x00Ǭˊˉ\x00Ǭǧʌռ\x00˾ʵʍߒ\x00Ǭʡ࿛ʮ\x00ǬʡۮʪGǢ&ʵ)\x00ˉʌŧ\x00Ǣˇʌѐ\x00ʡ̐ǰʍɐ\x00ǴȾ	\x00ʡ࿻ʉ|ʉũʉ࿹\x00ǬʷD˒\x00ʡǓˍʌ܄\x00Ǭʻ&ʡƨ\x00Ǭ˃ʡ̋ʰbʷ\x00ǬǡʺCˍ&ˌ)\x00ʡʖˇʑࢹ\x00ʡԭǕ\x00Ǭʻ&ʡƽŒ\x00ˤ¥\x00ǳȾ\x00Ǭʡҙˉ\x00ǬĈʳGʡ̋˄Ĩʣ\x00ˁʌÎǬ	ǫӎ\x00ʦအ\x00Ǭʡ͊ʼ&ˆĨʡǺ\x00ʭʌц\x00ʪ઻\x00̌ǦʏՑǬ	ǫവ\x00Ǭʡղˁ\x00Ǭˏ&ʭ\x00̈˳ʌˈǬ	ǫƫ\x00Ǭʡ࢚ˌʻbˈ\x00ʻǰʍɐ\x00ʡਸʉh\x00ʡ׋˂ʌԧ\x00ǬʦDʾ\r\x00Ǌၤʊʉʋ˅ൢʡ\x00ʬۡ\x00̏Ǧʎͨ\x00ǬKʡٮʣʿbʥ\x00ʡମˇʌЍ\x00Ǭʡ̓ʾ\x00̔˩ʌĺ	\x00ǬK̟ʵʍٖ\x00˂ྛ\x00ʡ࣍ʵʏЍǬ	ǫ̻\x00ǫ˃\x00̤Γ౯\x00ǬˇʎǛ\x00ʣ\x00ǫȢ\x00Ǭǥ\x00ːʼ\x00ʡל˂ʍԙ\x00˼ʵʍɻ\x00ʲߓ\x00ʷ౬\x00ʷʹ\x00ǬʡӺʡځʵʮ)\x00Ǭʯˈʡஎʾ\x00̗ˬʌĺ\x00ʡΛ˂ʌͫ\x00Ǭ˓CˉʧbʡƷ\x00Ǭʩ'ʲ\x00ʡۃʵʍؔ\x00˹ʵʌǛ	\x00ΓĎˇʌŝǙ\x00ǬʡසʡƷ\x00ǬʫsːD˒bʡŧǬ	ǫ࡫\x00Ǭʴʵ\x00ǩ̟ʌĺ\x00˴ʵʐ༅\x00Ǭǣsʡ෎ʫ&ʡྰ\x00ʡ¥\x00ˆʵʍՏ\x00Ǭʡ͊ʳ&ʥĨˀ	\x00ΓĎǩʌęǝ\x00ʡЮʡZ	\x00ΓĎˇʎËǛ\x00Ǭ˒Cˁ˂&ʺ)\x00Ǭʷsʡगˌ&ʡݥ\x00ǬKʩCʡ஛ʡྃʥ\x00ʡݸʡో	\x00ΓĎ˩ʌËǖ\x00Ǭµǡʹ&ʡҋʡʘ\x00ˍʌŧ\x00Ǭʮ'ˉ\x00ǬĈʩ༨ʫD˒éˀ\x00̓Ǧʏĺ\x00ʹʵʌ౿\x00̀ʵʌ̬\x00˂ǰʍŪ\x00ˏʻ\x00˸ʵʍʟ\x00˻ʵʍՏ\x00ʱǰʍୱ\x00ǬʴCʴ&ʾĨˋ\x00Ǭʣ&˃\x00ǬʡΫʡ༭ʡ֥ʡƝ\x00ˮʵ­í\x00˔ʵʓΉ\x00Ǭʡϻˍǌʵ)\x00ˏฐ\x00ǬˉCʳsʷDˑ)	\x00ΓĎǧʎQǗ\x00Ǭʵʌй\x00̋Ǧʍԙ\x00˒ড\x00ʿʡƷ\x00ǥʵʍӫ\x00˲ʵí	\x00ˉʵʌৣʌ̬\x00˘ʵʌ༷\x00ʡеʌļ\x00ʴʵʎՀ\x00ʡணǧʍ̣\x00ʡǓǰʍџ\x00ʡ̐ˈǬ	ǫȈ\x00̃ʵʍչ\x00˂ǰʍľ\x00Ǭˇʌ;\x00ʮʵʍ݂\x00Ǭµʡౚʺ&ʡ࿒ʡƟ\x00ʩʵʍŸ\x00ʿʌƽ\x00ˇ˳ʌĺ\x00ǫѿ	\x00ˢʡƧʌʏࣽ\x00ʡࡠ\x00Ǭʪsʡใʡ්ʡƝ\x00̡Γण÷öøùΓΙúûΐΑóôΒõ'æçèéêëìíîïðñòͶͷ͸͹ͺͻͼͽ;Ϳ΀΁΂΃΄΅Ά·ΈΉΊ΋Ό΍ΎΏǜ#ю	ѐ\nђєЉ\rЋЍВЗχϋلهνοߺࠂࠃࠅࠆ ࠇ!ࠈ\"ࠏ#Ϊ$ίͣԹͤՁ%׃&ׅ'ׇ(Ԟ)ԟ*̔ͥѷͦѻͧ،ͨؔͩOͪTͫXͬ[ͭȐͮࢱͯࢳ+ࢵ,ࢹ-ێ.ҷ/ҹ0Ҽ1Ӏ2Ȼ3ˌ4ː5˒6˔7˗8˟9͑:͟;Ǘ<ǜ=ǡ>Ǧ?ǫ@ݳAݸBނCתD׬EӴFӶGӸHԀIԉJחKכLТMШNЬOЮPаQвRиSкTмUȖVȰWȳXȵY؝Zت[ج\\ࣜ]࣢^ࣦ_ޒ`޲aܜbĉcċdčeĖf׍gϐhϒiɖjɫkɱlɷmɺn֗o֙p֛qձrճsյtչuջvսw̃x̅ẏzΊ{Ό|Ύ}̣~̥̧ࡅࡇࡉࡍࡏࡑײ״׶ĿŁŃŇŉŋŐŪŬųࡕࡗceglnpŸźżƂƄ Ɔ¡Ƌ¢ƍ£ڕ¤ښ¥ڜ¦ڞ§Ә¨Ӛ©ӜªՖ«ͦ¬̹­́®̓¯ͅ°͇±͉²ࣃ³؂´؆ͰʕµÆͱÈͲÌ¶Î·Ð¸Ó¹ÕͳØºÚ»é¼í½ï¾ñ¿óÀõÁ÷ÂϹÃϽʹࡧÄࢂÅکÆڸÇںÈڼÉܹÊܻËܽÌݍÍݒÎݙÏܡÐܣÑܦÒܨÓܪÔܬÕܳÖܵ×ʝØ6ÙC͵¨ÚӐÛփÜߝÝߟÞΟßΣàΤáΦâŜãšäţåŦҪ۫ÎУlΓÚΕÑ˥Ε¡ĝæǭͪɣɊƕ\x00˹ǤƬȘɱǃɲҀCц¬Ѿ|ΕєΕщΕҥΈµˎ=̓ήÂƇ̏ȡѮ«˴ëyιΕĝѝͷѰĻ\nú˖ɉș͋̞ґȚƀċņаûыƢćǗ˱ѥΛXͳĹΗ`ҚˏҟĹɭƖ̧&ϫτΕŕ&ҚЄXŬĹĜ`υѣʂɚBĹĚ`Ȉ͐ɼMƞ&ϠϓϦ˘ɧȋΕϓϦ˘ɧˀΕ˰ΕЮiÌΕΕΕΕΕ͜Ε̠ΕΊ&ȇɑѶŰ&PωŅ˕ΕĦΕϏΕîΕ˕ΕЍΕ͟Ε˕ΕЍΕȃ͌˂ȥ&ŏ˷ŢΕ̬ȖXǟĹƐ`ΧɸοƂ̀ΕĶΏџƦΕĶΏ΂ƦΕ®̯ЖɹǺǆʏ́Ε΀ȿƽͺϾЦҐʏϜƦ,ǦϴΕΕąÕƦΕĝ*φЦπʏϜͷɚʵК&̙˭ḯΕ̐&ƁĥΕҧ̴ýњΕ̛њΕɶњΕɐďħĮЦ͛ˋψɘ´ĂȐ̫ˠ͘˾ŗΕũО˻ΕĊďʹɬŶXå&ĈɌ6ёΕĝͺ̪Ц³ʏϜĊЛͺƸȿĴх&½ʏ»İͺƸX&½ʏ6ƦΕѷΕaĘķƱз҄Εā̾\\ƦΕĹ˕FĉĹΝσʙĹǁ̈ǪĹ¾ÃĞĹÆЀȑĹšчͮĹǇϩΚĹ̜`ΜΕ̬ɸοΣΕЃNο˙ΕҒçƳ̣ѻ9ЊûßƾěΕɜΕȾΕĖΕ¢ΕʿΕύΕЁΕǫΕóΕɤΕͽΕʧǽėĹǌЀћĹҠчǕĹ2ϩģĹ̡`ϽЌͧXʩɈ&ǰЈʁЛͣXʯ &ʎƖǥ&ˍѡĴпж&ǰğΕĳÊ÷ϿѰĹɯ`}ΕKȵÅɚЗĹš`˕ϩ§Ĺǁ`ΝЀρɚ¦Ĺǁ`¾ϩάĹÆ`šΕ̬jΕ̬ɸ͞ΕŪɸмƤҜŹʭǴѕ͚ǳѴ̌ͳ&΄Ô&˅7ΕįϝǊΕɂΕΕgΕéΕȎΕrΕϱΕ+ΕÇΕΠΕ˒ΕȮɅȕΕΕ˦ΕΕ͔&̵ΕdǠĹƗ`ǮΕ˩Ε:НɗѿΕŸĹѦ`eΕʜʃƛʼ̐&ÓɟΕ̐&ƁȽΕθΕƟΕǖĹЧ`ΘΕ{ĹƊ`лΕ͍Ц˼'Ư˨ΕͭЦ˼'҈ȶΕĠʻ˪Ĺэϩ͝Ĺͥ`ɰ£ΕƠΫůЦŐͨЇЦΪȄȪ̳ЦΟſʝØуˤŅΕΕŖǲʉvͼ&ˉΕYΕʋËˁŦȌѪψ˭ǣȂǑʚϰtŲ̀ť҅ĹЕǂΞĹǓǩĹǓ̮̩Цˈ΁5·̆ĆʠͩΕǚ&Ǿ҆ΕкðºƲĹςПΕǙЪѳQѭΎɘ´Εʲ̹ĪɄ¹ΌĹDͿ&nLţϳѸȷǝηȁŜЩΕф&ȍ̢ȉІ̏˳ЦɪˡϜèĹȍ`τΕ̐&Ɓ̬ʓοҌΕHΕ?Ε˶̝ʅ¿UõĹΒψƎɔ͏ΙɚõĹ\r`ζƖƃɔΕ&˔äXȖĹѓ`ϧѧo×Ε͠ΕќΕͬΕÉΕÉΕƧΕfΕǄΕΕƄΕĎΕϬΕьΕͤΕқΕЅΕΦΕǞͯ&ĦÀ;͖&ʐbϑ¿&҂Ѣ˞&˜ɁƌȠƋVʟͳUǉĹ̷`˗`˗ŧϺȲʨΨΕʥâŻʺ)ҕΕǏŭʘ˟ψơсҤĹΡϩнĹŔ`χȩҗΕòҘѢШ4ƓϤãͦϋ͉Ɔų΃˲Ε˕ΕϘɃˇɒȊĹŵÿҍĵ΋ΕǻΕюŒʤıĹĦ`τΕ^Ѽ˫ΕѤΕјΕБΕ̕ΕвΕЏΕǎΕŎΕĐΕȱɸʶʖȜŃǀͺЪXĺĒʷʏ6ƦΕΕҏȫćǗĕϭ\"OΕĀͫΕĝϮѢȔ4̖þÛ&ĬҗΕÏřĴćǗ˱ɋ͗̅ϕʽŠʦˊϣϨΕ˯@ɨϥɛƹ˧М΍Ωǅŝō˃ƙȨ̃Üʈɳ	̉ɇžƨɺҋ΅ǜÒЋk˸˽ƻTγ©ńˆҡ̑%ŴƅʌА¸ŇľϸRƚѺ8͆оːʛҨì͇ưʳҙ#ДеΑ͵_Ůù˺ϙġǒǋλĿʗѱ˓űhɎƿѨйȟ̤κƴɻțȓqɽβƼɫϒɩǛ̚Ƕɓȧɕ̓Ƒʸȴƥ̦͸͕҇Ǩ²>č̊ϗ­ƣÝң͡ѽŋҎɏ̥ǿŊТɴƘ.ѹĄ;дͰϯѫǸɢϖͻȼʰœˬЫʑĢ̰ȯGΔʕўбśȤ3ŞČȰĔň̻Ўҁđ϶ǯƵÙϹϔЭђΖȏϚĲȞʮȒɵХȬϟгʡɀ҃ȣɿʾőҔϛ̲яƩΉɾ]ƪΆΤʹɠͲЉ¯ȗʞΕϡ̺˛ƍĭǐВέƭΏɌÈΕљ¶ǘ̍zш¥͹ғΕϐƶ&ͱ̬ҩΕÞΕϪÁ͟Ε˕ΕЍΕ͟ΕĦΕʱΕͶΕ̎ΕҊΕɖΕŉΕ˿ΕСsǹʣ[Ł&ƜɦΕʔƦΕΥΕƔ&ƒΕ¼ΕǱΕЬˮȔ¤͑ЦѢcñĹʐēöĴȔʊ&ʐA&̏ώΕŀѠŨΕƶ&ͱ̐&ѯіΕ˵Εȥ&̼Sѩɚ͎Jȝ ʫïΕΐͺ̟ЦȳϜΕъ̨˚ǉЦˣ́`˄ƦΕɮΕРΕ½ΕїɆ͈ǵνŘΕÄΕşΕИΕuΕ̘ΕȆ͓ξΕ̗ΕѐĹҢĽΏΕǡϊmΕΕƱł͙ΕΕϢÐǷŷͅҖƺʍ̸ҝϲ˭±ƦΕĝѝͷѰГ͊ż҉&Ѭр$ʇáΕΕˌͳ&ҞƦΕ/Ε̭ƮФϻ&üøƦΕɷΕǼʬĹɭчxĹϷϩȭĹɞ`ɍ΢ŚĨǍĹδѵĹδƖ̈́&δϵƫE˝̶ĹЙȀʀĹˢȸʄĹ̽-(ĹƏ͒ūĹɥЌиĹтļ͂ĹЂ¤ĹαʆĹà͏źĹʪZĹεƖƈ&íƷ̿˭1ƦΕƝѝw&ÃŌ̱Ĺĩ͏ȻĹĸ!ĹīƖ&ṗƦἙѝȹ&ÖȦȢćǗίĹĚ`ȈΕÏǈU0ăĹŤ`ѲǢ&ʫƦΕ̢Ⱥəɝ&Ħμ̒<̄Ĺ̋Ϟł°ɡôҦûʢ͢ĤǬˑΰ&ęªď·I~ǧЦ̂ʒϜȅƦΕĝƉŽWʴЯ¨êόÍǔΕϼΕȝ7͟ͷ=͸	͸ͷǅͷ͠ȯ2ʌĳªŢ=ʉȵʉՁ2ʽ	ͷͶͷ±]͟Ñȯ2ʌĳªŢ=ʉˡʉ͟2ʽ	ͷͶͷ±\"ʉrͶͷ±1ʉƏ͟Ñȯ2ʌȞƣ2ʽ	ͷͶͷ\"ʉåʉ3Ͷͷ\"ʉÅʉ3Ͷͷ\"ʉ½ʉ3Ͷͷ±1ʉƏ͟Ñ	\nȥ2ʌĳªƣ	+ʉɌ\n³ʉɌ2ʽ	ͷͶͷ	\"ʉåʉ3Ͷͷ	\"ʉÅʉ3Ͷͷ	\"ʉ½ʉ3Ͷͷ±	1ʉ3Ͷͷ\n\"ʉåʉ3Ͷͷ\n\"ʉÅʉ3Ͷͷ\n\"ʉ½ʉ3Ͷͷ±\n1ʉƏ͟Ñ6=ʉˡʉ͟͡H͡ȯ2ʌĳªŢ=ʉɒʉஹ2ʽ	ͷIʉԡͶͷ±IʉསͶͷʃ\"ʉ½ʉɝʉӓͶͷ±1ʉͧIʉ૒Ͷͷʃ\"ʉÅʉɝʉŋͶͷ\"ʉ½ʉ3Ͷͷ±1ʉͧIʉ৵Ͷͷʃ\"ʉåʉɝʉǂͶͷ\"ʉÅʉ3Ͷͷ\"ʉ½ʉ3Ͷͷ±1ʉߵͶͷ±ʉÁͶͷ\"ʉåʉ3Ͷͷ\"ʉÅʉ3Ͷͷ\"ʉ½ʉ3Ͷͷ±1ʉ˛͟Ñ͢	\n2ʽ	ͷֽ		ʌ!	0\n	ૠ\n2ʌĳ\nª\nŢ\n=ʉȵ\nʉՁͶͷ±\n]͟ӈҪ\x00ʓæģ\x00ʢ\nͩ\x00;\x00øʡપʰ'ʴbʡť\x00ΐ]Þ^ʉ?P¤!_(H)S*»\x00øæç\x00øʰ'ʻ\x00÷ӕ\x00ʢ\n\x00ʢ\n \x00éΐ(\x00ʢ\nͭ\x00øˇ'ʤʿæ	˯ɤ˯	\x00øæç˓ʉ\x00æʒƆ	*ǙØǻÙP*ȂΓ၉ǹǗǯNΓଈ\r*.©$ªj«P\x00ʢ\nÓ\x00øèΐʌʤʐପè§	\x00øèæʌ!̒ΐ¡̓\x00çΓ௯æø	÷ۥ\x00çè\r\x00é̋ʉOç%ʉறê\x00æʵʌل\x00ʢ\n¶\x00øΐਁ\x00ʐæƾ\x00Αĥ\x00ΐçè\x00øç,ʉÿ\x00÷ੱ\x00ʢ\nE\x00øˆʧGʷ&ʰ)\x00ʢ\n-ø	÷ŉ\x00Ͷ5ˬæ\x00øê,ʉZ\x00æư(\x00ç>\x00Αĥ\x00øʧ'ʡ\x00÷ݫ\x00ʢ\nˤΐE\r\x00èæ\r̉Ġç%æ¡ʉР\x00÷ض\x00êʒפ\x00ʢ\n±\x00êê\x00÷ယ\x00÷˃%*ǦÆǩÇƀÄǟÃƩÈɔÉǉÅȽÊȮËP\x00ʢ\n:\x00ͽ;\x00øˉ'ˍ\x00çʡÝΐ	\x00ͺΐƎʎަ\x00æ\x00ʢ\n	\x00ΐĈHI\x00ʢ\n	\x00øéࣼ\r\x00øΑʉǩΐ஠Αʣæ\x00ʜæ̛\x00èΐʌʤʔҋΐʌʤʓࣕ\x00øʤ'˄\x00÷໨\x00ʢ\nª\x00ΐĥG\x00é¥\x00èΐæE	\x00æ̉ΐ+ʉȧ\x00éʌƓø	÷ઍ\x00ͷΓ͎ʉ͆7̞̞āéҧAæ3æֈʡɦê\"èuç+èȎΑŤΑŤŎó0Α0Kɂ'ĂçjΑÜ̜ʌɸʌΑçŇèΑç~èʌŐèʌඏèBæçèʌ׽\x00øˉˍ\x00ʢ\n6\x00æΐʌû\x00ʢ\nͪø	÷Ȁø	÷౓	\x00øèéʌ!ø	÷Ƿ\r*ǔ­ǋ®Ǳ¯P\x00øê,ʉƛ˦ʵʌű˧ʵʍࣞçn\x00æ$`\x00ʢ\nÛ\x00øːʢʤDʳ)\x00ʢ\nK\x00÷Ŭ\x00øʿ'ʳ\x00øçʉٸ\x00÷ҵ	\x00æΐʌUΑཋΐ%ΑଝΑ\x00Αĥv	ΐĈ\x00ʢ\n[ø	÷ࠉ*|LĔMÍNĩͶ¿OðPP\x00ʢ\n*\x00Γમç̽\x00ΐ]Þ^ʉP¤!_#S$»\x00çè§ø	÷೭\x00æĪè\x00ʢ\nh	ΐĈø	÷ਧ	\x00î0ΐ0*ľĎŃĂŀiø	÷׾\x00øçԤ\x00øç9ʉپ\x00çæ(\x00΅Ά·ΈΉ\x00ø˴\x00ʠæƄ	ýæ%è¡ç%ê\x00ê\x00ʢ\nX\x00øΐʌUʍͮʉh\x00ʢ\nP\x00ʢ\nb\x00æôĂèæçèïætΐæƑΑè˝\rΐ\rʡ௼ʌĞʉɨʌǞæ\r\x00êç+̋ʉOè%ʉЯ\x00÷໖\x00éʡºʉїç+̋ʉOʉк\x00øç,ʉ\x00ʢ\nF\x00÷ӱ\x00ʢ\nj\x00ʢ\nÍ\x00øê,ʉƂ\x00ʢ\nâ\x00èΐʌʤʒ೘\x00ʢ\n|\x00ʶʉZ\x00ø˒'ʢ\x00͹\x00÷܌\x00ø˾ΐ\x00æʌȐΐΑʌçç\rʉഥ\x00ʢ\n×\x00øê,ʉô\x00ʢ\nͣ\x00ʢ\n8\x00ʢ\nͦ\x00ʌæ\x00êƠéø	÷݉\x00øèΐʌʤʒ৕è§\x00ʊǵΐ*ŢΓ৸ŲΓ֓œΓభŝΓণĺři*ȂèǹéǗêǯëNíP\x00÷ࣰ	\x00ʵʌǥ±ʉБ\x00øæʉஷ\x00øæʉϫ\x00øΐ9êŎ\x00ʢ\nͬ\x00øç1ʉ\x00øKʬs˒'ʬʳ\x00ʞæц\x00ʢ\n೿\x00ͶčʉAʉŽʉōʉ@ʉAʉ\\ʉ.ʉĆʉȉʉÐʉʼʉʉՈʉ­ʉİʉMʉɆʉSʉɧʉLʉŵʉcʉèʉ`ʉŠʉlʉğʉ¯ʉĭʉ@ʉ\\ʉ.ʉʉgʉWʉLʉ?ʉśʉ?ʉڎʉkʉ¯ʉkʉ˪ʉTʉધʉۿʉஅʉјʉ೪ʉ\\ʉ\\ʉ.ʉʉʉáʉƭʉʉrʉ|ʉŝʉdʉźʉʉ˟ʉʉ้ʉ¹ʉŁʉäʉјʉʉʕʉWʉķʉʉ\\ʉöʉ\\ʉ.ʉÉʉ࢔ʉʉēʉ|ʉìʉ|ʉõʉdʉYʉdʉkʉdʉƢʉdʉÁʉʉıʉʉʮʉrʉĮʉʉöʉAʉ\\ʉ.ʉzʉƖʉ®ʉNʉwʉƤʉwʉϩʉΨʉxʉœʉfʉÛʉfʉɹʉăʉƖʉćʉɪʉǨʉȺʉ@ʉ\\ʉ.ʉʉҕʉMʉԒʉMʉɋʉSʉcʉSʉœʉSʉ˪ʉLʉzʉLʉĩʉ`ʉũʉ`ʉƸʉlʉǯʉʉXʉAʉ\\ʉ.ʉVʉĕʉ`ʉɁʉlʉƚʉÂʉWʉoʉNʉoʉҕʉ¿ʉŠʉãʉ¿ʉēʉ̤ʉzʉőʉ°ʉÁʉ@ʉ\\ʉ.ʉ෶ʉNʉīʉOʉǯʉVʉŽʉVʉÐʉVʉŁʉVʉȮʉ8ʉ|ʉ8ʉĕʉʉ{ʉMʉ¬ʉʉYʉAʉ\\ʉ.ʉ{ʉƃʉʉ٭ʉʉ࿍ʉMʉĭʉSʉԄʉLʉǔʉcʉիʉ`ʉİʉlʉǯʉeʉ¬ʉzʉĪʉ@ʉ\\ʉ.ʉáʉLʉQʉகʉWʉÇʉ?ʉʉ?ʉňʉkʉϩʉTʉ಄ʉ؃ʉ̀ʉNʉÛʉʉīʉʉÛʉAʉ\\ʉ.ʉ|ʉ®ʉʉɭʉMʉůʉSʉಹʉLʉ̈́ʉcʉോʉ`ʉèʉlʉVʉeʉķʉÂʉèʉzʉ¸ʉ@ʉ\\ʉ.ʉʉÔʉWʉիʉ?ʉʲʉkʉųʉTʉ࿮ʉઈʉྞʉొʉȰʉNʉЬʉʉrʉʉìʉAʉ\\ʉ.ʉʉƻʉSʉõʉcʉີʉ`ʉԌʉlʉȳʉeʉŁʉÂʉƻʉoʉSʉoʉՋʉãʉTʉƻʉ͹ʉ@ʉ\\ʉ.ʉʉଢʉ̊ʉNʉ{ʉNʉőʉOʉƹʉOʉʝʉVʉʉVʉTʉVʉҤʉ8ʉŚʉ­ʉoʉʉʉ¹ʉ@ʉAʉYʉĬʉՋʉzʉNʉ.ʉʉʉVʉėʉʉŰʉʉ̀ʉ­ʉȮʉMʉʏʉSʉɏʉcʉ¸ʉ`ʉgʉlʉɍʉçʉʏʉ@ʉYʉÉʉҷʉ8ʉĩʉ.ʉʉʉâʉƤʉWʉƭʉໂʉ?ʉɏʉkʉ̔ʉTʉʉTʉၞʉ෡ʉ®ʉʉăʉ\\ʉXʉWʉōʉ.ʉʉʉÉʉ։ʉʉĮʉʉ̤ʉ|ʉ3ʉdʉðʉʉ¯ʉ¹ʉʉäʉ¯ʉʉƢʉWʉÁʉʉAʉAʉYʉoʉƸʉǨʉƭʉ.ʉeʉ­ʉ°ʉ\\ʉ®ʉǮʉ®ʉʏʉwʉõʉxʉʉxʉඖʉfʉäʉ¨ʉʉćʉʉgʉʼʉ@ʉYʉʉ̂ʉlʉɧʉ.ʉ8ʉŋʉ­ʉೱʉMʉ?ʉMʉËʉMʉဍʉSʉTʉSʉၔʉLʉķʉLʉॶʉ`ʉĄʉeʉķʉʉöʉAʉYʉoʉযʉǨʉԒʉ.ʉeʉӍʉ°ʉÇʉ®ʉဆʉwʉcʉwʉӐʉxʉăʉxʉ̄ʉfʉ¨ʉ¨ʉxʉćʉgʉgʉėʉ@ʉYʉÐʉ¯ʉlʉಣʉ.ʉʉÐʉMʉũʉMʉ၃ʉMʉէʉSʉ¿ʉSʉŝʉLʉÛʉLʉǔʉcʉēʉ`ʉgʉeʉ8ʉʉ\\ʉöʉXʉrʉĮʉ.ʉƹʉКʉʉɪʉʉĭʉ|ʉÔʉ|ʉՈʉdʉęʉdʉŅʉdʉÁʉʉOʉʉɭʉQʉðʉʉXʉAʉYʉʉɍʉ®ʉŚʉ׿ʉŋʉ`ʉÂʉeʉķʉÂʉËʉoʉĕʉ¿ʉMʉãʉÉʉēʉęʉzʉʉ¯ʉwʉ¨ʉźʉ@ʉYʉkʉˀʉMʉèʉ.ʉWʉÇʉNʉźʉOʉōʉVʉ.ʉVʉzʉVʉõʉVʉɩʉ8ʉSʉ8ʉƚʉʉėʉcʉϕʉʉÛʉAʉYʉ{ʉʝʉ¯ʉXʉ.ʉĘʉɋʉʉfʉ­ʉÐʉMʉĩʉLʉŜʉcʉãʉ`ʉēʉlʉŜʉeʉ\\ʉÂʉœʉçʉLʉ@ʉYʉáʉǟʉÐʉȷʉ.ʉıʉӄʉQʉƭʉWʉŅʉ?ʉȘʉkʉŠʉTʉ୶ʉ൒ʉઆʉǜʉNʉËʉʉÐʉʉȺʉAʉYʉ?ʉÇʉwʉɆʉ.ʉ¹ʉkʉ`ʉ̺ʉeʉ3ʉoʉɁʉoʉ̄ʉ¿ʉƢʉãʉ?ʉēʉÔʉzʉ|ʉ¯ʉTʉ¨ʉŝʉ@ʉYʉʉśʉSʉੳʉ.ʉʉèʉNʉƖʉOʉฯʉVʉʉVʉƙʉVʉǂʉ8ʉʉ8ʉ˕ʉ8ʉƬʉʉƖʉcʉèʉʉìʉAʉYʉ൦ʉ°ʉƙʉ.ʉʉõʉSʉӍʉ`ʉŜʉlʉoʉeʉwʉÂʉƙʉoʉÇʉ¿ʉęʉãʉ¿ʉzʉĘʉ¨ʉ?ʉ@ʉYʉdʉ̈́ʉMʉÇʉ.ʉĆʉೞʉeʉNʉʉNʉКʉOʉėʉOʉӐʉVʉʉVʉƸʉVʉρʉ8ʉʝʉcʉ̙ʉʉʉŚʉ@ʉAʉXʉçʉ\\ʉ.ʉʉʉ?ʉ൹ʉ҅ʉ8ʉfʉʉWʉʉ?ʉMʉėʉLʉʉ`ʉćʉeʉʉĿʉËʉ@ʉXʉʉÛʉ.ʉʉʉrʉ®ʉâʉrʉWʉăʉ?ʉɁʉ?ʉƃʉkʉԌʉTʉྠʉ܁ʉąʉ­ʉĄʉ\\ʉXʉ?ʉNʉ.ʉʉʉʉʉ¸ʉЧʉáʉŅʉʉŜʉ|ʉƭʉdʉƖʉʉЧʉäʉʉʉÁʉkʉĭʉʉAʉAʉYʉ­ʉǔʉgʉɄʉ.ʉʉÉʉĿʉìʉ°ʉʯʉ®ʉwʉऽʉxʉƗʉxʉèʉfʉǮʉfʉρʉăʉ۵ʉgʉƚʉ@ʉࠠʉğʉeʉrʉ.ʉTʉÔʉʉðʉ­ʉʮʉMʉÂʉMʉůʉSʉśʉSʉİʉSʉѵʉLʉԯʉcʉƙʉeʉQʉʉöʉAʉYʉSʉeʉgʉʮʉ.ʉʉÉʉĿʉŅʉ°ʉƚʉ®ʉůʉwʉðʉΨʉxʉƚʉfʉMʉ¨ʉˮʉăʉय़ʉgʉȉʉ@ʉYʉNʉ?ʉeʉ¨ʉ.ʉTʉÔʉ­ʉMʉࠈʉMʉőʉSʉ˒ʉSʉąʉSʉǂʉLʉwʉLʉňʉ`ʉYʉeʉŠʉʉ\\ʉöʉXʉWʉĭʉ.ʉʉʉĆʉÔʉʉźʉʉĭʉ|ʉÔʉdʉʉdʉfʉdʉÁʉʉҤʉ¹ʉྭʉWʉŁʉʉXʉAʉYʉTʉŰʉfʉėʉ.ʉĬʉ˕ʉcʉzʉlʉԯʉÂʉzʉoʉõʉ¿ʉɆʉãʉƃʉzʉ¸ʉ¯ʉĮʉçʉӓʉćʉɩʉ@ʉYʉrʉ¹ʉLʉèʉ.ʉĬʉӲʉĩʉOʉŽʉOʉɭʉVʉ¿ʉVʉɄʉ8ʉǬʉ8ʉËʉʉäʉÐʉʉlʉŚʉʉÛʉAʉXʉçʉ͹ʉ.ʉʉҫʉɩʉÐʉЗʉʉ̊ʉMʉ·ʉSʉɏʉcʉȳʉ`ʉ԰ʉlʉƃʉoʉʉ°ʉ։ʉ@ʉXʉʉśʉ.ʉʉʉ¹ʉʉrʉȘʉâʉÁʉWʉňʉkʉAʉTʉକʉෝʉıʉNʉĕʉ­ʉīʉʉìʉAʉXʉxʉxʉ.ʉʉʉMʉ௑ʉcʉ¬ʉlʉʉeʉӄʉoʉĄʉ¿ʉÛʉãʉʉzʉŽʉ¯ʉèʉćʉ?ʉ@ʉXʉSʉৼʉ.ʉʉҫʉ̂ʉNʉ̎ʉNʉ̺ʉOʉðʉVʉƹʉVʉ˕ʉVʉňʉ8ʉ̔ʉʉ̔ʉ`ʉ̂ʉʉʉȺʉ@ʉAʉXʉĿʉʧʉ.ʉʉʉʉNʉʉųʉrʉʉWʉ୺ʉȳʉVʉLʉʉ̙ʉMʉʲʉlʉĕʉwʉĪʉ@ʉXʉʉɋʉ.ʉʉʉ¹ʉkʉʉǔʉrʉőʉQʉ฾ʉWʉ8ʉ?ʉkʉkʉଖʉӲʉğʉʉůʉʉöʉAʉYʉĮʉԏʉgʉЗʉ.ʉʉʉzʉĪʉçʉƬʉ°ʉçʉ®ʉŋʉxʉWʉxʉ̀ʉfʉųʉ¨ʉԏʉćʉʉōʉ¸ʉ@ʉYʉʉǮʉeʉųʉ.ʉʉʉʉVʉʉœʉMʉìʉMʉʲʉSʉdʉSʉīʉLʉ°ʉcʉäʉ`ʉʉeʉఴʉʉÛʉAʉXʉƻʉʉ.ʉʉʉ˒ʉėʉ਄ʉäʉ̺ʉVʉðʉʉYʉSʉ̎ʉcʉīʉlʉųʉoʉȳʉ¨ʉ¯ʉ@ʉXʉʉoʉ.ʉʉʉıʉáʉáʉİʉdʉĩʉʉʉâʉƬʉkʉ഑ʉଠʉğʉOʉȷʉMʉTʉʉʉ\\ʉ@ʉAʉXʉwʉʧʉ.ʉʉʉƤʉ๚ʉ¸ʉɹʉʉİʉdʉËʉäʉůʉâʉĘʉTʉƬʉʉőʉ`ʉÉʉćʉŵʉ@ʉXʉʉ̤ʉ.ʉʉʉʉ԰ʉ¹ʉŰʉʉũʉrʉWʉQʉƙʉWʉ¸ʉ?ʉȘʉTʉĩʉNʉŝʉcʉǨʉʉöʉAʉXʉgʉ̈́ʉ.ʉʉʉQʉƃʉãʉ·ʉçʉ?ʉƻʉЬʉ°ʉÇʉwʉҷʉfʉȰʉăʉ̄ʉʯʉ|ʉōʉէʉ@ʉXʉeʉѵʉ.ʉʉʉOʉ°ʉʉQʉʉðʉMʉzʉSʉȘʉLʉŵʉcʉŅʉ`ʉʉlʉxʉoʉYʉʉYʉAʉXʉwʉğʉ.ʉʉʉŽʉËʉʾʉɪʉˮʉຨʉĄʉ۷ʉĆʉ@ʉkʉąʉMʉīʉlʉʉ¿ʉgʉgʉɄʉ@ʉXʉ­ʉɹʉ.ʉʉʉĮʉŅʉǢʉƸʉęʉ୦ʉÉʉĕʉdʉzʉQʉ౰ʉĄʉNʉËʉ8ʉ?ʉcʉԄʉʉÛʉAʉXʉwʉŠʉ.ʉʉʉ\\ʉϕʉìʉgʉƗʉlʉŜʉೋʉǢʉfʉ¹ʉĆʉʉǬʉcʉɍʉoʉőʉgʉʉ@ʉXʉ­ʉÇʉ.ʉʉʉĄʉÁʉƤʉLʉ{ʉıʉĬʉʉáʉȷʉäʉĘʉ?ʉ၁ʉzʉVʉɆʉcʉũʉʉʉAʉAʉ\\ʉ.ʉ¬ʉʉ¬ʉʉ¬ʉʉ¬ʉʉ¬ʉʉ¬ʉʉ¬ʉʉ¬ʉʉ¿ʉȮʉçʉ̙ʉ®ʉAʉöʉ\\ʉ.ʉĿʉ˪ʉwʉĿʉxʉìʉxʉǯʉxʉȉʉxʉچʉfʉōʉfʉȮʉ¨ʉƹʉ¨ʉʧʉŵʉıʉ̣\x00ʢ\nä\x00ͼ\x00÷ࠚ\x00ʢ\n\x00æçΐʌɳç\x00æʌ͉Α\x00æø	÷ۉ\x00èΐ(\x00ʢ\n2\x00÷ˋ\x00ʵʍݴ\x00÷ђŹʦÕʌʹϧʉ\x00øǍç\x00æΐਈø	÷ໃ\x00×\x00÷੣*DŻĉĸĎňĶŀi\x00øæʉƂʉÀ	ΐĈ\x00÷໸*óΰżખø	÷ଜ\x00ͷ̕NʉēʉN4ʍdĿ¶¦Nʉ¸ēʉ?4ʍϨĿ·¦Nʉ|ēʉW4ʐɄĨ¸¦Nʉ|ēʉT4ʒĭĨ¸¦Nʉ|ēʉk4ʍƸĨ¸¦NʉĬēʉ@4ʏŠĿ¹¦NʉēʉY4ʎăĿµ¦NʉēʉX4ʑȰĿµә	̔ʌঁʌΐø	÷ೝ\x00æौ\x00æ\x00΀΁\x00ʉǵΐ\x00ʢ\n(\x00Α໠ʌ!\x00ø͸ø	÷࿴	\x00æĕΐį(	ΐĈqr\x00øΐʌUʍࠗʉh\x00ʢ\n»\x00ʋǵç൭	\x00øʡɦêħʌ˴\x00ʢ\n\x00ʢ\nŹˮ৭\x00øKʮGˉˑbʡƲ\x00éǮë	\x00ΐ(Þ_»\x00çæƈ(ø	÷Ѵ\x00ø˽ΐ	\x00øΐæţʉſĂççʊđçঋæ\nʊțççਊ\x00͹Γސʉȭ	\x00øȖè˖ç*ŕŴȟħiø	÷۾\x00æΓƩΐĵ\x00ʢ\n@\x00éƳëΐċ(\x00÷֍ø	÷Ԏ\x00øè9ʉȊ\x00æʉม	ΐĈ\x00Ϳ\x00øǍè\r\x00øéʡºʉۊêࠤʉњ\x00éΐèЀΐèEø	÷ฎ\x00ʢ\nM\x00êΓӌΐ\x00΁\x00øKʢCʡོʹbʤ\x00æɓʉќ\x00î[Źó3çࣴAɤçæ\"éuè+éȎKi\r\x00Ͷʌ¶ʎ@ͷʌĞʉϔ\x00Ͷ[଴\"AƐ±ƋƵi	\x00ͶΓӡʉਿʉ༾\x00÷ྎ	\x00øΐèţΑ\x00ʢ\n\x00ΐ]Þ^ʉrP¤!_ H!S\"»\x00øˑ'ʳ\x00ø\x00ΐæɡʉ\x00øΐʉÀ\x00ø˹ʌŸ\x00;Ιƕ\x00ʢ\n³\x00ʢ\n\x00Αĥyø	÷ʷ	ΐĈ§¨\x00ʢ\n¸\x00êʌ˙é	̉é4̃é঻\x00÷ҏ\x00ʢ\nͰ\x00è;	ΐĈ\x00øʏྉëø	÷ـ	\x00æņΐį(ʉh	ΐĈ̦\x00æ¥\x00øΐʉԋ*ăΐƥóæżçƘmƥóéżê੼\x00øʰ'ʡĒ\x00ʢ\nQ\x00ʢ\n§\x00øࡂë\x00΄ʉ໰	৷ʌUΐΑȆΑԫ\x00æ5˘(\x00ë\x00æĊè\x00æʍ͙\x00æƷè\x00îɄê\x00øʡѢˁGʮˍ)\x00øʡ୤ʡ̛\x00øKʿʳDʤˁ\x00÷श\x00øΓǊèʌ५ç\x00ʢ\nÃ\x00æ́ø	÷̻\x00͸Γӭͷ\x00æ࿥	\x00ͶΓӡʉ@ʉȹ\x00æĭèø	÷ƫ\x00éΐçEø	÷া\x00÷ୋ\x00÷ѿ\x00ʢ\n4\x00ʢ\nU\x00øˇDˑ\x00ø˦\x00ͻ\x00èΐʌྡ\x00ʢ\nͮø	÷ݑ\x00Ϳ\x00ʢ\n3\x00ʢ\nµ#*ΓࠐÐñïÇÏÛå«áýòÚ½Ýi\x00ʢ\n\x00ʢ\n\x00èΓӌΐ\x00ʢ\n\x00Αĥ¦\x00Α\x00æȊ(\x00ʢ\nÒ	\x00ç̃æ<ʉŪ\x00ʢ\n£\x00òȎ׫Ȏ̫ï\r̦ǵð\r̦\x00øΐ	\x00æçΐʌ!Ͷ	ΐĈ\r\x00øΑņΐ9Αņ\x00ê́ȉౌ\x00ʢ\n¯ø	÷မ\x00ʢ\n\x00ʢ\n²\x00Αĥ	\x00çʡĊæéĲʉǺ%*¹	ċ\nĽƤ\r&ȋĜP\x00êʌƓ\x00æè̶\x00ñ>ø	÷൓\x00èʡڞΐΑóôõ̉ʡఝʉǉ\x00ʡݰ_(\x00ͶΓѱ\x00øê,ʉÀ\x00øóø	÷శ\x00ʢ\nL\x00øΐΐ&́ʌ౤ʌUȊդʉh	\x00øΑʌŐΑ\x00ʢ\nZ\x00ïîA\x00øː'ʡť\x00ʢ\n.\x00ͷΓࠊ	\x00øæΐʌ!\x00Ά·Έ\x00øΐΑ	\x00æःóóྲɃ\x00øê,ʉƶ\x00èΓ༑\x00êΐ(\x00èéΑ\x00ʢ\n#\x00èΐʌʤʓ໵\x00ͽΙƕ\x00Α\x00͹>\x00ê்è+ʉњ*ΓЏmΓνrΓεÃ¶ąi\x00ʢ\n/\x00çí\"\x00çè\x00øê,ʉϫ\x00çâ\x00øKˁsʡ˘ˁʬø	÷ਫ\x00ʡ༦æƛ\r\x00é̋ʉOʉ඗è+ʉޙ\x00éǆë	\x00ʡ͏ͶΐΑ\x00ʢ\nw	ʡ݃ʌʵΐ\x00ëìΐ\x00ø˙ΐൂ\x00ʒæƨ\x00÷͂ǰΐ໧\x00ʢ\n\x00ʢ\n\x00ʢ\n7\x00øʡʡʡÎ˦ʍ਎ʍļ˦ʌȽʍԓ˦ʎǐʌඤè6˦ʽp\x00æê\x00øнΐ,ʌ˦Ź̟௮ʑ঒ʌΐΑ)\x00æʌƓ\x00ñʉ༼ø	÷ऌ\x00ʢ\n\x00øʡӦˉ\x00ʢ\nzæ	*×â­°i\x00ʢ\n$\x00ʢ\nÙ\x00ʢ\nÜ\x00í>\x00ʖæļ\x00ΐʌ$éø	÷إä\x00ʢ\nB\x00ͷ͸͹\x00øʵʌ໬\x00ͺΓ઄\x00ʢ\nd\x00ʢ\nº\x00øȍΐ\x00÷ු	\x00øçæʌ!\x00ʢ\n\r\x00΍\x00ʢ\nͨ\x00ʢ\nl\x00æ5˩ΐø	÷ࡶ\x00ʢ\n]\x00æ5˩èʉÿ\x00÷౜\x00ʙæƟ	ΐĈwx\x00ʢ\nŃéjæÜ̝ʌæéƯΐéæéEʉŖ\x00çΐʌû\x00øç	ΐĈ\x00ʢ\nS\x00êܶ\x00øê*ľďi\x00øKʮCʤʡ஻ˁø	÷൐	\x00îΐ\x00ʢ\nR\x00ñʉ୹ΐÕ\x00ø୽ë\x00ø˵ø	÷Ȉ\x00΂ΓٙǬ¼Ǩ½ȇ¾ǎ¿ƘÀƌ»»\x00çóèփ	\x00øΐʌ̢ó\x00ʢ\np\x00ʢ\n'ø	÷௛ø	÷လ\x00øΑÒ\x00øʉѼæ\x00ø˒'ʬ	\x00øΐæ̀Α\x00÷௅\x00ʕæſ\x00øΐʌUʍೊʉhø	÷໘\x00øêè\x00ʢ\n\x00øç9ʉŴ\x00øΐʉɔ\x00Αĥ\x00øʰˁʹʻ)\x00ʍæ§ǰΐʌ৿æΐʌདྷæ\rΑʌ٨\x00ʢ\nͳ\x00êèɱʌʽʌǟʌɗ	ʡൽʦÕʌནʉǉ\x00èʼɾʉÀ\x00ͺê	\x00ͷóɘ&ʉ͙\x00øKʧGˍʿʡ\x00ʢ\nr	\x00΂΃΄΅\x00ʢ\n\x00Γ່\x00æ੆ç͓ΓǊΐʌޤʌĞʉɨʌғΐΑħʌĞʉŪ\x00ç̄ʌ๊̄ʌήø	÷๭\x00ΐʍࣺ\x00ʢ\n\x00÷ࠅ\x00øˑʴʡΖʡǶ\x00îΓ༴æΐç\x00øʡʜʢ\x00èΐʌʤʐͯ\x00æČé\x00øˇ'ˆజ˶ʐࡽ	̦%Γ΁ΐΑ	\x00çΐΐʌ̯\x00øͷ	çǕΐó\x00çêŎԐ\x00Αĥ\x00ʢ\nÁ\x00ø˕\x00øΐʉɖ\x00ʢ\nÅ\x00ʢ\ng\x00é\x00Ώ\x00øΐÒ\x00ʢ\nå\x00ʗæŧø	÷೜\x00ͼ\x00ʢ\nfø	÷୆	\x00ΐæΐçE\x00ʢ\nʹ\x00ʢ\n`\x00è>	\x00øéæʌ!ø	÷༝\x00ʢ\nÏ\x00ʢ\n°\x00øΑ\x00ø˒ˍˆʴ)\x00ʢ\nt\x00ʢ\n	\x00îKò:ñ\x00÷ଚø	÷ঈ\x00ʢ\nÈ\x00øç=ʉૢ\x00øʡϋʷ˄éʰ\x00ʢ\n©\x00ʢ\n´\x00ͶΙওΐ\x00è$Ú\x00çʉં\x00ʢ\ny\x00øæʉƝɼ\x00éʐƦ\x00÷׉\x00øç෿\x00çæ+ʉZ\x00øç,ʉZ\x00ʢ\n¡	ʉѡʌUΐΑ\x00Αĥø	÷՜\x00ʢ\nÌ\x00øé=ʉ॥̞̞āΓ̟±ɂø	÷঱\x00èΐʌʤʔͯø	÷ୈ	\x00ΒǩʉkÛ\x00ʢ\n\"\x00øèΐʌʤʔ؇è§\x00øµˇs˄'ʮbʤ\x00ʑæܦ\x00÷ଯ\x00æ;\x00èʉ\x00ʢ\n\\\x00ʢ\n\x00ø˘\x00ßʌ֌ΐ\x00ͷΙϯ\x00ʢ\nsʿæ	éɤé\x00ʢ\nu	ΐĈno\x00΅	\x00æʌʶʍfΐ¾	\x00èΓිΐΑø	÷ʐ\x00ʢ\n	*ŬźĂŀi\x00øèสèགΐʌ!\x00èʉÿ\rʉѡʌUΐΑ%ΐʌü\x00ʢ\nà\x00ͽ\x00ʢ\n\x00ʏæƛ	*3AK\"i\x00éȅë\x00˛Γŀ	\x00çɎΑô\x00ʢ\n\n\x00ʢ\no\x00èʌ$ΐéȒç\x00ʢ\nm\x00æ\x00è>\x00˿ʌ¶ΐ˳ΑģŤʌғΑı೗è+ç\rê\x00í>\x00ʘæʛ\x00ʚæŴ\x00ʢ\n\x00ʢ\n\x00ʢ\nÆ\x00æɓʉǠ\x00æ̊ÕʌĞʉฮʌెʉOʉʎ\x00ͷø	÷ج\x00ʢ\nͤ\x00ʢ\ne\x00ø˄CʿGʿˍ)\x00ʢ\ni\x00ʢ\nÚ\x00ʢ\nÐ\x00øê,ʉÿ\x00øΐʌUʎҟʉh\x00øΑΐ9ç̅ʌʍහçBæçݷè̃˿ʌʍటʌ஑˿ʌ¶ʍÉèʌɶæΙ൪è̅ʌ¶ʍÔæǱé6æતΙၑ\x00øê,ʉ\x00èʉЊΐ\x00÷Ҏø	÷ၘ\x00ʢ\n\x00øˍ'ˁ\x00øɟè9ʉȊƱ\x00Ͷ̕NʉNēʉ4ʏκNʉ?ēʉ¸4ʌĪĞÁ¦Nʉ?ēʉĬ4ȏൟNʉ?ēʉĆ4ʒ༈NʉWēʉÉ4ʌഏNʉWēʉ{4ʌဒNʉWēʉƹ4ʍ௳NʉWēʉı4ʎॄNʉTēʉę4ʍಛNʉTēʉǮ4ʍरNʉTēʉǬ4ʔঙNʉTēʉǢ4ʒছN¤ēʉƤ4ʌ଻N¤ēʉũ4ʍ૩NʉkēʉÔ4ʍཚNʉrēʉĮ4ʔЃĞÁ¦NʉēʉĄ4ʑİĞÁ¦Nʉēʉ˟4ʎЃĞÁ¦NʉēʉŜ4ʏðĞÁ¦NʉâēʉĘ4ʍࡻNʉâēʉɁ4ಷNʉâēʉˮ4ʔஉNʉQēʉŚ4ʑ໪NʉQēʉ˒4ʓ࡯NʉQēʉ̎4ʏຽNʉQēʉś4ʏڝNʉQēʉķ4ʏٞNʉQēʉǟ4ʒܡNʉQēʉƗ4ʐκNʉēʉˀ4ʌ౻Nʉēʉì4ʏจNʉdēʉΙ4ʎ˟ĞÁ¦Nʉdēʉʾ4ʒ੡NʉdēʉŰ4ʑÂĞÁә\x00ʢ\n0\x00Ύ\x00êè§\x00ç;æqʉ؋ʉΓ\x00ʢ\n¦\x00ê;\x00ͷΐΑ	Γܲΐ4ΐħʌ!\x00æચΐȆʌвΐ੉ʌUʌၐʉh\x00ʢ\n¬\x00øˆʡжʳ&ˆ)\x00ʢ\nV\x00ñʉࢼ\x00øΐʉƆ	\x00îŤΐŤ\x00ʢ\n>\x00æ\x00÷ଧ\x00Ι×\x00æ֎˿	˿ʌʓ࿡ø	÷ତ\x00ʢ\nË\x00΂\x00Γಟ\r\x00èæɯ̃æ8ʉୖΑ	\x00æΓޜ;Ü»	\x00èʡĊæéဏ\x00øʡӞʡٲʴ&ʮ\x00͹[ĺȠƧøi\x00éʑଏ\x00éƺë\x00æǿ\x00øç9ʉୣ\x00Ͷචóȩ\x00ʢ\nÄ\x00éʍȊ\x00ʢ\n¢\x00Α8ΐ\x00øʻDʤ\x00ʢ\nCø	÷ޱ\x00éæèE\x00͸͹	\x00æçê³ʉ\x00ʢ\nx\x00ΐΐʌӥ\x00ͶΓ઀ΓࡌΐȖǰçæ0ΑæǾèø	÷फø	÷ןø	÷࠰\x00ʢ\nÑ\x00Αĥ	çǊΐó\x00øʤˇ	\x00ʡ͏ΐæó\x00ʢ\n\x00æ[ģıi\x00Ι݌\x00ʢ\nͯ\x00Ͷʵʌű\x00ñʉү	\x00æȆϲʌ̘¬\x00éʉZ	\x00ʡෙʌȐæԪΑĲ\x00æˤΐE\x00éʍฃ\x00æ\r\x00èΓࣾçΐæó\x00ʢ\n=ø	÷๕\x00Αĥ\x00ʢ\nYʉײྑ\x00êƃ̥è ƃ\x00ͷ[ƪƫƯȟƍİʡ˩ĸùÿ§ȟƟ༩\x00ôæ=ʉܑ*.e¿fðg$hP	\x00ç˿ʌΐ\x00˅ʸ\x00é>ø	÷࿄\x00ø๨éʡºʉїç+̋ʉOʉี	\x00ðïªʉ฼ʉవ\x00øʡʜː\x00é;\x00éƣë	\x00èΓ˚çʌ̖\x00øˁsː˄ʳ)Ăææʉđætʉæֿʉæ؏\x00ΐ]Þ^ʉWP¤!_+H,S-»\x00ʢ\nɻȖ̡ΐ)\x00øìʌUȌդʉùìʌUʍͮʉùìʌUʎҠʉh	ΐĈ\x00ʢ\n¤\x00è;ø	÷௥\x00ʢ\n	ȷΓࠕΐΑ)\x00æ>*.i¿jðk$lP\x00øéæø	÷ཛྷ.\x00æΐ\"ʉ߃\x00ΐĤΑ\x00ʢ\nͥ\x00ʔæÀ\x00ʢ\nNø	÷ฬ\x00æ5˪ʉԖ\x00ʢ\nͧ\x00Ͷ[^ʉQºÝP\x00Αĥp	\x00ðïªʉ࿜ʉԷΐ	\x00éʌ$ΐįĐ\x00ʢ\n\x00øͺø	÷ุø	÷ϛ\x00÷௲\x00÷ೄ\x00ʢ\n!\x00ʢ\n\x00ͺΓь\x00ʡĥ\x00΃΄\r*zΓࡁ¸Óäøi\x00é\x00øȍΑ\x00ʢ\n,ø	÷ิ\x00ʢ\nv	\x00æ[ĕŎņŎČ࡚	*ƆĐĴĲi3ŃëjΑ6ìΑë~ì6íΓ૷ΐëìó\rʌ൩ëæç̏çíêëíèíé߹	ȼΓͽΐΑ)\x00ΑĥŃêjéÜ̜ʌɸʌéêƯΐêéêE\x00ʢ\nq\x00æɓʉ௸ʉô	\x00çΐ\"ʉਪʉȊ\x00ͺʡĥ	\x00øçΑʌ!ΐΎ˩\x00êʒދ\x00æΐʌû\x00ͻΓඹ\x00ʢ\na\x00ʢ\n\x00ʢ\n{\x00øèʉhø	÷ச\x00øç9ʉƶ	\x00øçΐʌ!ø	÷੨\x00Ͷ¥\x00øóÒ\x00÷୳\x00ΐ]Þ^ʉ|P¤!_HS»\x00ʢ\n¨\x00øç̞\x00ʢ\nÖ\x00øΐʌUʎࡋʉ๮ʉѼΐʌUȊĐø	÷ࡾ	\x00̛ΐΑ١óཀ\x00øê̞\x00ͷç\x00øʳ'ʴø	÷࿁\x00ʸæ§\x00ʢ\nͱ\x00Αɺ\x00éƼë\x00æͶ\x00æʌ$é5*T͠98®Ę͡CVÌ=͢%P\x00æ[ģ̃èוıèɯ̃è8ʉೲ\x00øê,ʉŖ\x00æ\x00øǍ́ȉí\x00ΉΊ΋\x00ʢ\n;\x00ʢ\nA\x00ΒƩ(\x00æ̎æíA	\x00é[Ŏΐ\x00͸ொΓඓø	÷଩	\x00ø˪ԥ̗ʎ࠱\x00çΑ͔æ\x00÷̨\x00÷ඔ\r\x00øè̉̌çՠʉૂ\x00÷೯ø	÷૬	\x00ø˹ʌௌ̛\x00ʢ\n\x00øç9ʉ྄\r\x00øΑĕΐIΑĕø	÷ܙ\x00ΐ]Þ^ʉTP¤!_%H&S'»\x00͹Ιါ\x00ʡݞʌȐæԪʍfΐท˯˭̷ʌʹ\x00øìʌUʎͥʉùìʌUʍઋʉh*|QĔQ¿RðS$TPΐ(*ÑöÕi\x00ʢ\n\x00΃\x00éʎആ\x00Αĥ|\x00íʉÿ\x00íìëE\x00øΐʌUʓ༽ʉh\x00÷࣠*|UĔV¿WðXƸZǫYP\x00ʎæ˦	*¤J$KP	ΐĈtu	\x00ø˪ԥ̗ʎً\x00øΐʉι\x00øǍΐ\x00ʢ\n\x00ΐ\x00ʢ\ná\x00øæ\x00ʢ\nß\x00ʢ\nJΐ(\x00è\x00ʢ\n}\x00Ιਏ\x00ç\x00ʢ\n \x00øæȆí\x00Αĥ\x00ʢ\n\x00øèè§\x00øʌ˙ΐ	\x00ðïªʉࠝʉୌ?Ăèèçƪéΐè~é,ʌͿè\rʉϥç6êʤʎ΋ΐèϼʌêĻΐè\rʉʻʌêŇèʉऎé,ʌ࢓èೖæéè˽ø	÷ٯ\x00Ιൃ\x00ʢ\n&\x00ʢ\nÝ\x00øç9ʉÀ\x00\x00æ\x00ʢ\n͵\x00øʌԢΐʌഭΐ-*ǵÍƎÎɛÏɒÐɀÑȍÒāÓûÔđÕĵÖɗ×P\x00øΐʌUʑࣃʉùΐʌUʏ༯ʉh\x00ʢ\n\x00æ5˕ʍଳ\x00çΐʌ!\x00æ̔ʌն\x00ʢ\nIʿæʤʉດ\x00Γ๝ç֟\x00ʢ\n«Œ\x00ʢ\nÀʉࣻá\x00øʉ͚ç\x00øΐʉѶ\x00øçʉƂʉZ\x00øç9ʉݒ\x00æʎƟ*ſųΓଵŭΓؐ\x00òȎ(\x00éæ9ʉZ*|a¿bðcƙdP\x00ʢ\nÞ	\x00˙ʹΐΑ޺\x00Αĥ\x00Ͷȳΐ*.è.ªèª$ÚjèjP\x00ʢ\n\x00æʎ੿\x00çʌƓ\x00øæʉƽ\x00éΐèE\x00æ\x00øΑʉǩΐΐʌ༙Αથæ\x00øç1ʉZ\x00éĝë\x00ʢ\nk\x00ʢ\nͫ\x00ë>\x00éǷë˰\x00ëè§Ź˩ΐଢ଼ʌ؀\r*ǰΓ୚æǧΓ੬æ̵\x00ʢ\nc\x00ʢ\nT\x00øKʡࠢʡࡳ˄ʡԅø	÷ࢿ	ΓඞȸΐΑ\x00͸\x00æçૄç͓\x00øæʉத\x00ͶʵʌϜʌæʍɈ\x00÷ҬèΓ΁ΐΑ\x00øçߢ\x00ò>\x00÷Ս\x00øʮCˍCːʡʌø	÷΃	\x00éíŹí\x00øʧʡǶ	ΐĈæqʉ࣢ʉϺèřʉഊʉЊé\x00Α9ΐø	÷જø	÷স\x00ʢ\nn\x00æփ\x00ʢ\n½\x00øʢD˒\x00ʢ\n\x00ʢ\n\x00øˉ'ʡĒ\x00ʢ\nO\x00ʢ\nÂ\x00ʢ\nÕ\x00÷˧ø	÷ए	\x00ΐǵʎǜͺ\x00ʢ\nÉ\x00ΐȿΐ\x00æʡۙ\x00Ͷͷ͸͹ͺͻͼͽ;Ϳ\x00÷ؓ	\x00øëìʌ!\x00ʢ\n\x00óæ=ʉဗʉഖýç1ʉ཮è1ʉขʉʎ\x00÷˞\x00øʡೡ˄Gʢʧ)\x00èʉh	ΐĈz{\x00ë;\x00çʉǽ\x00ʢ\n\x00îŎç*ŋŶƇħΓې\x00æʌ$ê\x00øΐʌUʏงʉh\x00͹[@¼P\x00ì́ʌೃ\x00ʢ\n¹\x00èʉZ\x00ʢ\n5\x00ʢ\n¼\x00͸è$\x00øôæ	ΐȖÀÐ\x00êë\x00øçΐ\x00êéǧΑ%ΐèԕéȎగç\x00÷Ӡ)̞̞āΓ̟DìΓெ¦Γ༵ÀΓఃzΓ஁ÂΓ૪§ΓभÅΓߙÉΓי\x00éčë\x00ͶΓ͎ʉ͆\x00øΑ9ΐ඄ΑIΐΐʌ̯)̞̞āΓ̟İDśŠŊűƅŰŦŨŀŒōţŞūŷɂ\x00è¥\x00øΐʌUʎพʉh\x00÷௻\x00ʢ\nã\x00Ϳ΀\x00ʢ\n)\x00÷ู\x00ΑTΐ\x00ʢ\nͲ	ΐĈ¤¥\x00ʢ\n1	ΐĈ¡¢\x00èʡŷèø	÷ী\x00ʢ\nG\x00ñ>\x00øʹʡѾʻː)\x00øæʉŖ	ΐĈ\x00éĢë\x00øéø	÷̡\x00ʢ\nø	÷ྀ\x00øʻ'ˑ\x00ʵʌϜʌæʍၚÞ\x00Ιଭ\x00øʡාʡߊʿ&ʤ\x00ʢ\n\x00çæก\x00æΐʌ!\x00ʢ\nÇø	÷ˌà\x00éêŹˮʔϐ\x00øçè\x00ʢ\n¥\x00øKʡຟʴ&ʤbˇ\x00ʢ\n¾\x00øʤGʧˁ˄)\x00êéèE\x00΀\x00ʢ\n®\x00Αĥ£\x00ʢ\nÊ\x00ʢ\n\x00ʢ\nH\x00øèΐʌʤʓਃè§\x00ͺ/ͻ\x00øê,ʉǺ\x00ʢ\n_\x00øʡǀʰã\x00͸ʉॣΐ\x00øïð\x00ʢ\n<\x00é઺\x00ëΓॐΐ	\x00ðïªʉ௹ʉԷ\x00éǓëø	÷୉\x00øΐʌࣀ\x00æçѲʉ\x00ʝæƆ\x00÷ҡ\x00Ί˚\x00øːʿGʹDʡఆ\x00øʿ˒*·ùÿĂćëÞÔíüß»Æãèi\x00íʉZ	\x00æΓ˚ΐʌ̖\x00ʢ\nØ\x00æçΐʌÙΐʌǗʉô̈ʌȝΐ\x00ʢ\n¿ʉΓ\x00˚Γ\x00͸ʡº̫̊Α%ΐՠΐ\x00Ͷê\x00Αĥ \x00øˉGʡဈʡ߻ʡťʡ඿æ\x00ø༎ë\x00Αĥs\x00çΐ(\x00ʢ\n­9Ăèèçƪéΐè~é,ʌͿè\rʉϥç6êʤʎ΋ΐèϼʌêĻΐè\rʉʻʌêŇèʉ૿æéè˽ø	÷ཆ\x00øΐʌUʎҠʉùΐʌUʎͥʉh\x00è\r\x00æΐ̉ΐʌĀʉװ	*ÈΰġěƁi\x00çΑČýΐ%Α¡Α\x00øʤʳ\x00ʢ\n^\x00øæÒ'ŃëjêÜʌŐêëཬìΐë~ʌŐì6íΓສìêëëæʌ$íӮ\x00ʢ\n\x00÷ಒø	÷ૡø	÷۩\x00ΑʉĒ\x00øèç\x00ʢ\nW\x00÷Ȣø	÷࿼\x00ͻͼ>\x00øʵʌുʵʌၠʐञʌӶ\x00æ5ß(ΓΦΐȖıø	÷ಆ\x00ʢ\n\x00ʢ\n9\x00ͼΓ૔ø	÷ୗ\x00ʢ\n\x00ʟæƽ\x00Ά\x00ʛæÎ\x00ʢ\n·æqʉƆ\x00ʢ\nÎ*|[Ĕ\\¿]ð^$_P\x00øç9ʉǽ\x00ΐʌ$Α\x00ʢ\n~å\x00øêԤ\x00Αĥm\x00ʢ\n%5*įCĦ@ė;<ċ=>Ľ:Ĝ?ƢAĈBȜDȪEȟFP\x00̆ÌʉБ\x00ʢ\n\x00øˆʡжˁDʢ)\x00æçο\x00ͻ\x00Ͷͷ͸*ư²ª´ƈ³ǾÂUͺɑº0°P\x00ʢ\nÔǰͶæE\x00Όî\x00ç\x00ʢ\nDȎ(	ΐĈ}~ø	÷ାø	÷ൔ\x00æȼæ\x00øè͠\x00êࡕ\x00ʢ\n+ĂèèʉôèïætΐæƑΑè˝\x00ʢ\n\x00øïʡÝï̦߫\x00æষʉOʉNʉ?ʉWʉTʉܣ\x00΀\x00øKʡ˺ˉ&ʡ௡˄\x00ʢ\n?-*ť4Ġ/ł5T69081Ę2C3Ǽ7ĥ8Ć9P7689ΙΛ:;ΖΗΘ5()*+,-./01234ΔΕB		ķ\nŐŒĦ\r¬µ·åíðóöù=AEOuwz}~1 6!ě\"ĝ#ğ$Į%ź&ż'žׇࣲ#ԊĂеͯ̈́ȩĽˢTƉ֢͉ę֞̉ϿԟɄʟ˾̴շϞτÄӛ̅Ө0ɺÍºհʔʄΧׄ։֤ҍѥb̆҇}ӶՖΪхѽºːѥɛ˗їʹèȭӿΐҿȨºζѥɛɂֻջ͢ύ˼ɗ*ºɵԵƫϺºԵһȽºԵϏº:Ǧ՝͕ʞՆϯºýº˒ºAԗʠºÞºӘºӚȡMǽԶӌт֮ЦѥΠϴȭŠȪÅƺʜҏeÏĿѥͻ)º̩αˎº̋Ѫzǌ(ηǑÆŢҎ˙ѭοʸȭ΁ҿǻׄįѐφºť̖ѣʺEϸħѝğϗͱˣȬΡŊ_¦Ђ͚ɟǔ̡͟хºøºѨº̂ºŨѥ֑ºըºʨºǒչºǛº»ϪºɘºŨʬͨˈģɠѥůˋǖ͎^ɰºŎѥҴºҡºpº;ºָºљºõӪԮԭQȟфҊвгˣtѥҗΥнºśºȋºяаćȭ΅хҿƤºŧ̀ʧׄտƀѥʵß˃Ɛκ̱ҽȭΕ֛ͩGׄŠͩΗѴJȭԥʭׂ֛ׄqʭŏºѕҥ̒ŪººѼº͇ɫͥºʾºՐºųж̸ϚºūҳLĳаՁȭ̊хҿƤºђѥϘ\nºԪºĪŕºŌԱԙº˻ºΞΛоЁnºŃՌϚº˂ºͻº̵Զι̸ϚºϹºġºѱˠ͋ºƱºr̃Ԛȭ=ͳȂϛռѥɡѷыºĆ ր˅Uʋ՛̭ʏº˛^ʽ̈чӍ̬ΣɍվՙׄƤӤŋЂ֍ѥй΋ϟσЂ҄ѥй̿ձŝЂϕѥйȸͦұ̀ƳѥйěѥѲǼѐѲºղѥйäºղѥйӕº҄ѥй֊ºƳѥйǼºŇժѥйdʑяʣķ̼Ɉ˟ՏԿȔЫ˦Π8ֵȃԳϮº̳֝ѴͬϨȭHՎТ­ȀԒº¨Ʋϲ\\Ƥºχȭ|ѥЬΒʍՋׄʝʂƪѴúӈȭДΐҿ˝̜Ѷѥʝºɸ̹º́ºũΑӹǉѤºʡׄȕʅ̄ȭĉѤŚ͘ˣВǉѤʲƻ{ˊԈǾċ+ϓμºǯºŧ©ׄ±ǹʥׄЙЭđׄϽƬƔȭŬѥ!Ӝº͂Ǯȁֳ̏ºȜЋϋҰȮºϬցº͙Юȱқ~սçѥ̙Еѥọ̑ѥֆǍѥȐ<̚ѥ¢˽ѥƢºÈаıз/҆ĲºȞº˘͒ԑȭ֒хҿˑŷOаıɳɥԩȳυӹǉѤƬƨRӹǉѤºɔׄīǹӬׄĩЭôׄъƬǳׄĝѐͺº¯͌ͿºӔºЖºխĊºғȦÁȭҌƋҿº־ďʚϑӒÖɨȭҤ˧`Џōˣ՟˩ѥǨºǚˏºӀ·̪ׄѐҵºթԯɎǿÕϵºǷºPº˭ׄ̓Тhԕ́Օ̺˿СԠºɻù\x00ĤЊûȵՓȄ ʎьԇϊº΢º֬ºœʐӚԧƂ֪ϒʼիׄҝéɇÿĺºİºˣΟԘԅ1֣ºǺºǺºǺºԛº¡ÒѥWЍ˲ΓºǘѥׅΆ[ʹ֎ȭŜΐҿɓƦº֍ѥйǴƶȿºӱχѥͭŨѥņ΍ѥĥѥϡþѥҀɃѥʖȒºӆѥ§¼ׄ4ţºΦωɢƾ?њºΝº֨ºuΚ̻ˉËѥόѥʳФѥҁϧѥƘºØ˕ʯººűºӏĄ'ºŻѥȣºяŶ̼̾γΕżēӖѥ͖ĵ̥ºˁºѠ՜ĐҖѬлςºпÃºȈÝ͊ƕºиº֠шº֔ɾׄÀÂå¾ЃԻЩюǟՍёǙ׃ԾϜɦəѥ͆ѐֈ˛ѥgӪҧˣ͠.ϝǜºИºҬºʩºҾѥ͵ºϰ¶ӻѐƤºӻºKºǭѬл҅º·ѬлςºǭΎԋ˫ƆէҍѥĢφºЪׄ	ѐ֟ºЪѥ	ºѓºԸº϶ºНƧóѥºŔºкº˘Ӻ&ѴКοɞȭʻҿх\"ȉсӉ֌ºɪºҩºͷºʗեׄƤЎբׄñϦϷׄǸ֐ǄׄȆֿǃƩaĔρΤ֭ȰвŴͮȭӷ̎ѐϼČºԵ֯ȼºԵҔ̩ɹЗºҙ֥ėɏƯՈªŀԨȭ˺̟ƗƮׄ˓ћԂֱׄѫ֧ׄկѡƶʙ2ͣˆѥ̦МºŮϐ̮̀ľ«ȭȎќҿüºֽәººѦº˳ӫºɧǉѤº˰RԣլǠѐîºť´ȭƠħѐîºĨĖæǕǓ̵ξºӳºȫºšoӾѴ¿ׄsŁѥӥθπՑ,ɤ֏ɴȠșǈơºѩºȇºŗāփȭNƋҿº˨ӁаӼȭնхҿºӁºԍˤ¸Ќ>ϻǀԢɉºȗǂðºº͑̐ººͶҺ°ЈȊǢԽͫ¥¤ׄԥŦΩˣqӅɐБŏºծºưºʤѮˣΰĻ҈ңºÓ̗FǅβʂBׄւգև̀~̍ЂϏȺ̛ѥȷº¬ѥԀҕѥ֦ʒѥʕÊզȶ֖Ȗӵ̫ǝĚȑÇc͔ȧÉº֕ºԺºэϱʦº͈º͝ºҞſƖƇƦºўյӮׄ;ĞºĘ͐ׄƟźƥƤºщ׀÷ɋºԌºřºǁƃ½Ւǧώˬʆ̯^̇ѥńv̞ɝƵͼXбּ͞ǹѯׄƑЭӗׄĎƬȅׄ˞ѐяƤºɆºϥº$џɬ²Լºҋìԝׄ®ѐՃ̯^ºѥϢºӄѥͧɚׄӃȻՂą˜ӧƼºոºÐ˱ZЛƣº̝ºԆº5ɼҨλ̔łͤêºíΙɊºƝϙՅÑͰºҷˣӊòƄȌőºǩŭŤ΄ҮѾ̀Ѱº΀ˀľ«¾7ׄxɷќԹԜºׅºĕȭƫΥΔǆֺҜƴȭі˔ЏƸˣɀѥАƭΏÃºΏÃºяГׄʉǹĮּׄЭwׄƑƬҲׄĎѐ˞3ІiȹѺׄŲĭЯׄҪĶаćЂѥ֡хԲаƹЂѳѥĦхԲˍҹдӮЀ˴ț͏ѥ̽Ēľïв̓ǶѥМ˹ќ̢՗Ĺ̑ҠϔƊɿΜºáҭ¹ΫºǗºȤºӇąǞāִȭĬƋҿǺºȚlǇºӸҍȭ֚Ā֛м͸ϏӢº̕ºǡº6ƌ̸֓ȘЇХҫʃ͗ƍy˯]ѥʌºՉѥºяŶ̼ԫׄΠΌăӣӡӂ̔οդȭՀҿӋοդȭǰҿƎѥŹֹŞѥӐήѥȴպº՞ѥňґѥ̪̠ž³ķʿ̨ЂϾѥΐќԲ̔Պ̤ׄǹʇֶׄЭϖׄ֩ƬÔׄ%ѐƜº΂ɖԴÚºɽºϠºȍººӭºˇ̪͛ׄѐҟºδº̌ëƽººʊºјχׄԎƚăѥSºҍׄ҉ѐǱº̧ɭѥ՚ºĸDÜѥãɑºâՒΈׄƷ-ºɩѥׁ̪kɶȭΨʷϤӟºяʴƓŰʀͅºղѥйԖºŇ[ʹʶȭ֜ΐҿƦºղѥйŇժѥйƿ˥Ѹѥ˸ƋŅºѥя˵ׄՄѢǤׄȐͦ9ׄֆ_Ǭׄȏӽѥ̙ŶĠʓȭΐҿˌºՇǫɁÎӦԁУ͡ŶķYрֲȯ԰V֙ƅԦЃԻЩͰѐººȓŽˣǥǲmӠӓǵlàƙ˶ӰƦººʱ˚өϭǣɣѥƛşѥƞǪҒͽŨ̀iׄʫТ׆ׅТŉͽº̷֗ѥºѧ̶CººԬººººɱϫȭΊǏОº˖ׄҚεºʘօЧׄĜԓºɕѥºɯ×ȲԔƒÛҦŐѥº˷ºʮjӮȭΖ̘ΉӲνմ͓ʪաǊψɲӴϚ֫Ř͍ϣΘԷº҂ºԉºœ֖ºŵº֋ºԐȾӎºɅºœӚƏȝԡӑѵˮԏŖöĴ@ѥˡºуѥºַºčºяχѥέăѥŸƤºχѥǱºЅѥǱְºцɌҸҘ҃ӯºίҼ˪Ĉՠׄʉ̲͹I΃Œаƹ̀ϩѥÙԄѥͪхѿǋԤքׄʁҐ՘ͲʈµϳՔШ£ԞʢºļººʰʛƈºfѥºєѥЄ̰ѻ֘ºҢȢɕѥҶˁүȥЉаć¾˄ӞѥǐхԹ\rРÌΥѹºĕׄƫΥӝºճПºɜԃǎiʹÁɮάɒƁ͜º\x00ׇ\x00Ζ®͹	ʌ෱ͶʌΖ)؜ʡþʉ๶ʡܴʵʑณʽ6ͶʵʌĹʔʯͣ೬ʵʐైʽ6ͺʵʌĹʐŰͤ౥(n	\x00*ɗʰʌི\x00ʢ\n	\x00ΑTΐŋ8	7࢕\x00)|(\x008Α\x00ͶΖࢦ˯˴̷ʑ෪Ζ\x00ʢ\n\r\x00Γ࿚Ζͺ\x008ˍDʡģ	\x00ΑĘΐÛ\x007͂\x008*Ͷ)ȫĿ\x00ΖT;\r(uʡº)+(:ʉحʉީ\x00Ι}NʉÉ4ʉQL˹ʌȼ÷,Ö-˫	\x00Γ̜ΐŲΑ\x00ͽ(\x008ʮ'ʡǶ\x008Ζʉݭ\x00Ͷ±;\x00Ζ9˂ʌ̴΀)\x00ͺ)ͷ\x00ͼʵʌǥ\"ʉɜ8	7ݘ\x008(,ʉ	͸Ǽ༁Ζಘ(n\x00+ʉ٫࣒̏2%3ǵʉள3)\x008KʧCʬʡΖˍ\x00ͽ;\x007ಠ\x00ʢ\n\x008µʡѢʡǀʻbˆ\x00-ʉ	\x008)*ʌ!\x00ʡ௓	\x00ͽΐĵʍྺ̰ΓࢲΓƩ(ࡪ)^Γޕ\x00;;\x00ͿΖŃ\x00(Ζ¾\x00΀\x00΂ƀʉN)ɽ\x008K˄Cʳ&ˆbʡÎ\x00ʢ\n&	\x00ȗΖʎɌ!8	7ڽ\x008µʷGʳDˆbʡÎ\x00ͷΖ	\x00ΑĘΐŶ\x008ʳ'ʡť\x008(+т\x00Ζ=ͺ\x008ͷ9ʉɖ\x008ΉÒ\x00(Ɇ)\x00*ȱ(\x00*?(\x00ͶƐ̎ͶƐΖǦ	\x00ΑĠΐ¶\x008ʵʌű	\x00ΑťΐA	\x008ʉഫΖN\x00͸)§	\x00)Γ஡(ͷ\x00(ı(ı\rΑ\x008ˍʰCʢ&ˉ)	\x008Ͷʌ«ʉŗ\x00*)ʂ)ʌߪʉZ8	7໔	\x008ͷʌ«ʉΙϒΐ̃ʉəΙϒΐ	\x00Ζ̇˺Ζ)	\x00ΑĘΐĉ	\x00ΐĘΑ(̆\x00ͷêΓط\x008΃Ò\x00Ͷʌ$Ζ\"ʉӸʉľ	\x00Șʵʎʹ\x00ʢ\n8	7༆8	7࿊\x00Ι}Nʉ{4ʉƢ¾(0ò\x00+ʉżΓŕ0ʉԀ\x00+	\x00ΑĘΐŕ\x00)¥	\x00ΓѬͶ(ΐ\x008Ͷ'ͷ8	7Ȉ\x007ӕ\x00ΑƘΔŏĺͼĐ+Đ»\x008ʹ'ʴ\x00ʡӒʌǒ(	\x00ΑĘΐò\x008ʡԶˁGʧʡʌ\x008ʳDˇ\x008Kʡþʉक़\x00Έ;\x00Αłժ\x00͹\x00)Ζʌʤʐк\x00)Ζʎ݅\x00(ʡĥ\x00΀ΖĂ	\x00ΑĠΐř8	7ವ\x00Ι}Nʉ{4ʉŁ0ĳΖ¾Η˫\x00(Ãʉŗ\x008ːʡǀˁ˄\x00Ͷĉ;\x008ɟͷ9ΐ	\x00ΑĘΐ·\x002Γଅͺ\x008ΖIʉී\x00*;	\x00Αłΐ»	\x00ͻΐĵʍǋ8	7ృ\x008Ζ³ΐИ8	7ຠ\x00)Ζ\x007௒*ŋΐŶΐĽƇΐĽħΓ൥ΐ̵	\x00ΑĠΐñ\x00,;\x00)+*Χ	\x00ΑłΐƁ\x008ͶyZʉќ	\x00ΓഄΐzΑ\x00͹ͷ	\x00ΑĘΐĶ\rΙЌΙʗ̘Ζʑ๔(n\x00(Γा\x00*)(E\x00Ι}Nʉ{4ʉA¾)0ò	\x00Αłΐ3\x00-ʉÀ	\x00ΑĘΐ±\x00͹Ζ\x00)ͺʌû\x00΂ƀʉO)ʂ	\x00(ͶʌΖ૳\x008ͷ=͹	\x00Ͷʌถ͸ͷĲǾ(ʎෂΛপ(ʎડ(Ȇҁ(Ȇϲʌ̘ऍ)nŞΎ\x008Ζ\x00Ͷ.Ζ	\x00(Ͷʌʎȧ8	7ৱ8	7ख़\x007ཱྀ\x00ΖȿΖʌڤʉ৺8	7ఊ8	7׎\x00([ƆΊïĐͺĲ˹ʌȼĴΙ৪;ʉ๯	\x00*)ʌ৓\x008ˆ'ʬ\x008*Jʽ8	7܂	\x008ʍ߁*ʎϽ\x00ΗŞΌ	\x008ʉ߈Ζ4\x00(Ζǡ	\x008+(ʌ!\x008Η3\r\x00*)ʍ્)ʌ೧ʉZ	\x00ͶƋΖKǘ\x00(̡Ζ\x00ʡÄʍрͦ¾	\x00ΙঔΖ¾ľ	\x00Ͷ|(͸8	7࡞	\x008(ģ,Ζ8	7௰8	7ࢪ\x008ΖGΖɲ(˖ʉZ\x00Ͷ\"Ζ\":(	\x00ΑłΐĴŒ\x00(Ζ\r\x008Η&ʡÝΖ%ͷʣʉƄ\x008KʳCːˆˍ8	7ʐ\x008(Ζ¾ȖĲ\x00ͷ;	\x008()ʌ!\x007൷͢ΖΗ\x00ʢ\n\"\x00Ζ9ͺ	\x00΀ΐĵʍԀ	\x00ΑĘΐý\x00(Ζʎۼ	\x00ΑĘΐÝ	\x00Ά5Ç9ʉГ\x008ͶyZʉР\x00ͷ\x00Λ×8	7ֻ8	7૲\x008ʿʡ˺ˍ˄)8	7Ѵ\x008Ί³ʉх\x008ͻJΖʎڦͼJΖʍୁͽJΖʍ̥\x008*Iʉϟ	\x00ΑĠΐ­\x00+ͻΔE\x00(ʡˍ(\x00(વ\x00*Ŀ*Ĩ*N*ēΓ୐(<ͷ௞(ʌݼ̂໎(ۋ\x008ʡՕʡ؛ˍ'ʡ̽\x008ΗJ(\x008ʹ'ʻ*3ΐėAΐįKΐĦ\"ΐį\x007໌\x00͹ĺ	\x00ΑĘΐƆ\x008ˇʻˍˆ\x00)ʌ஬Η%(ħʌࢠʌʽʤʔمிΐ͸´\x008(=Ͷ\x00*Γ؝\x008)ʒྵ	\x008*Ζʌ!\x00*Ԃ+\x00->8	7ದ8	7੠\x00(Γࣷ\x00̆͵ʉǆ\x008+),yʌ!Λࠏ(n\rȴ(1ʉƒʉƵΐΐĤ´Ş΃\x008)\x008Ηʉ҂\x00;Ιƕ8	7ܹ	\x00ΑĘΐä̰ʵʍޗʵʌଡ଼(੽\x00Ζ®͸\x00*ͷ̶\x00Ζ®Ύ*?̞̞āΓ˂ΐɞDΐĽìΓඵΐ¦ΓජΐÀΓ௎ΐzΓڮΐÂΓବΐ§ΓோΐÅΓݐΐÉΓೢΐੴ\x008΅\x004ʉেΓŕ̏ơͻ+ʉŲʉأ	\x00ΑƌΖΗ\x00(\x00ʢ\n	\x008Ͷ8	7ଲ8	7ܞ\x008ɔʉŪ	\x008)Ͷʌ!8	7ຢ\x00Ͷʌ$ʉҚΖ\"ʉʎ\x00Ͷʌ$Ζ\x00ͽΖŀ\x00Ζ®΁Aࣝ((˿ʌ!(t)˿ʌ֞(Ó))ʌրΙ௝*˿ʌ)Ó*6+Ιʗ̘*ؿ+&+ķʡҦ+ķB˿ʌȽ)ຘ,n\x00(ʉ\x00Ͷʌޠ\x008ˍ'ʿ\x008ʉҭΖ4&ʉӆΖ4\r\x00),),yʌƔʌԲ8	7౾8	7࠹\x008Ζ_͸̶\x00)Ιܰ(\x008Δ2͹\x00(ͶΖE\x00ʢ\n	\x00ΑĘΐ«\x008ʉ౑(	\x00(ʌৠʌ඼(\x00ͶʌîΖşʉԞΗ\"ʉ{Η\"ʉÚʉ3Η\"ʉÍʉ3ʉƿΗ	\x00ͷƟΖ)8	7ؽ\x00*+ͶƸ͖ĩΓా\x00̚Ͷ(	\x00*ʡÝ(%ͽ\x00Ζ®ͼ\x00ΐđʍိ\r\x00Șʵ*4*Ŀĵ\x00Γସΐ(\x00(͸(\x00ͶʌîΖşʉҚΗ\"ʉrʉƿΗ\x00Ͷʏ࠽Ζ\x00ͶΖΗ\x00Ζ(ƑΗ\x00ͼ\x008ΖIʉ࿈๏ΓๅΖ\rʌ܇	\x008)(ʌ!ΓुΖ	\x00(5̟Ζʌü\x00Ͷ\x00ͷ(\rΖ\x00ͻ\x00*\x00(̉Η\x007ڜ*3)A*\"+K4ʉ߾ʡÝ+İͺŨͻDΖDśΖŻ+(ŠΖĉ+(ŀΖŀō1Ŋʡºͻ+ͼűͼuʡº(+ͼ©ƅͻuʡº(+ͻ©ŰͻuʡºΖĎ+ͻ©ŦǤΖĶซΖň୲ΖĶŒ,ţ-Ş.ū/ŷ0P\x00͸(ʔŞ΍\x00ʢ\n\x00+	\x008(ԩ(ʌ!\x00)Ζ\x008(Ĵ\x00,˼ʌ!\x008ʴGʡϻˑéʤ\x00+ʉౄ\x007ޔ\x00ΐđʎ௃\x00(Ι۸ͶͶʌ̯\x00ʡࢾʉ౧\x00Ιڡ.	\x008ʉ၊ʉಁ(\x008ʰ'ʡƲ\x008(9ʉǺ	\x008ΗƆ³ʉх	\x00ΖT()\x008ʵȄ̩ʌӅʌUǶॡʉùʵȄ̩ʌӅʌUʍઌʉh\x00ͺ;8	7࿏\x00Γ༐ΐΑ\x00ΖĥͶʎప\x008ˍ'ʷ	\x00ΐĘΑʌü	\x00ΑĠΐōΓ०\x007૸\x00Ζĥ\r\x00)ʌ$ʉಶͶ*Ȓ()	\x008ʉۜʉ׹(\r\x008.೮Ȏڟ.௪-9ʉɔ	\x008ͶyZժ\x00(Ãʉ	\x008ʉඡΖN	\x00΁ΐĵʍਗ\x00Ι໕ΐͶ\x00(ΓĝΆ\x00(ΓΦΐ\x00ΖT*	\x008ʉကΖN\x008͹\x008ʬːsʷ'ʡʌ	\x00Γ໦ΐħΑ\x008ʷCː˄'ˍ)	\x008Ζ¾ě8	7֗	(ΙྖΖě)ֺ	\x00Ζȑʡº*\r\x00)ΐʌ͸͸\r(˯˵̷ʐࢍΖ\x00˷ͼ	\x00ΑĘΐŬ\x00(͹\r͸\rͺ\rͻ\rͼ\rͽ\r;\rͿ̞̞āΓ˂ΐɞΐĽ±ΐĽѥ\x00)\x00Ͷê	\x00(Ι࣌ΖǄ(\x00-ҩͶʌ!\x00ͶΖ(\x008Kʡþʉ೓\x008KˆGʰʡ෗ʰ\x008ʡÝ(%;ನʉೳ\x008ʤsːsʰˆ)8	7ז	\x008ʉӆΖ4\x00ͶʎُΖ	\x00ΑĠΐŠ	\x00Α9ΐÐ	\x00΅ʲ΄+΃\x00ͺĔ(\x00*)uͶA+)ë\x00ΒǦʉk*ĆĐ\x00ͷɕʍ೚\x00ʢ\n\x008ʷCʡൊːˁ)\x00(;8	7୊	\x00ΑĘΐß\x008Ͷʌ˴	\x00ΓєΐìΑ8	7ਞ\x00(ʉÿ\x00+*Ľ(8	7׏	\x008ʉެΖ4\x00Ζĥ\x00Γྷ(*\x007ෟ\x00Ζ(\x00͹Ƨʡĥ\x00͸	\x00ͶËΖ(\r*ſ(ų)ŭ-P\x008͹Ϳ	\x00ͶΖĜ(\x00(ê\x00(ģ\x00͸	\x00*Ȉ)ʎʍ	\x00ΑĘΐħ(\x00(ƶʡĥ)\r\x00)Ι࿠̉Ζ+ʉɕʉ໾\x00Ͷʌ$ʉޏ8	7಼\x008(=ͷ\x00ͷ;\x007˞8	7ལ\x008(,ʉZ\r\x008KΖķʡҦΖķ\x00(ʵȄí*ÈΐĜġΐĽěΐėƁΐė\x008ʰ'ʡĒ	\x008͸\rʉിͷ\x008(Jͻಽͺʌ!\x00+ʉܼΓŕ.ȎĐ8	7ࣤ\x00΀ʐ৒\x008(_ͻ	\x008)ͷʌ!\x008Kʡþʉݮ\x008Ζʉς̰Ζ੄*^Η*ҳ+Ͷʌാͷ+͸)\r(p͹	\x00ΑĠΐÃ\x008ʡ˘ʢ8	7ӻ	\x00ΓۂΐΑ\x00ͷͶ	\x008(1ʉಋʉɖ	\x008(1ʉౣʉ༪8	7ຐ	\x008Ζ=͸\rʉZ/Ń)jͻ6*ͻ)~*š*š\rʉӝʉࢬ(ؠͻ)EͼǿΑƘ)ŏĺͼĐ*Đ௿	\x00ͷΐΖħʌ!\x00Ͷʌ$Ζ\"ʉÍʉľ	\x00ΑĘΐƅ	\x00ȗ˹ǽͳ	\x00ͼΐĵʍੀ\x008)ʒՖ	\x00ΖĈ\x00ʡල\r\x00ȗͿ*4*Ŀĵ	\x00Ϳΐĵʎջ\x00Ι}Nʉ¸4ʉ?0ĚΖ8	7ؑ\x00.[Nʉ{4ʉO¾-0i\x008ˁDˆ\x00ΖȬ΁;*ƆΐĽĐΐĴΐėĲΐė\x008ΐ8	7ٴ\x00(Γѓʉľ$\x00Ή(	\x00ΑĘΐå\x00ΖΖʌӥ\x00ͷ>\x00Ι১(ģ\x00ͺΖΗ\x00ʡÄʌɧͪ¾	\x00ͶGΖƤ(\x008ͷ9ʉι\x00ͽΖŀ8	7਼\x00/΂+ͻ	\x00,Δ()\x008ΆÒ\x008ˑ'ʡģ\x00)Γ଄(\x008ͷ9ʉԋ\x00(Ιݗΐ\x00ͺ¿Ζ	\x00΁Ζ¾ĺ\r\x00.ʌ$-u(,ȕ-ളԫ\x00ͿΖŃ\x008Ηʉς\x008ʴ'ʡƲ8	7ต\r\x008ʵʍɼ),y+Ĳ*×ΐėâΐĦ­ΐĦ°ΐĦȴ(1ʉౡʉǎΐΐĤʉƵΐΐĤ´\x007ӠΖ	\x008ΓǊ+˖)ýΐ͸ʉճΐ͸ʉ˼ΐ͸ʉƴΐ͸Ԩ	\x00ΑĘΐĸ8	7਌	\x00ΑĠΐâ\r\x00+)ʍ਽)ʌๆʉZ\x00ͻ¿Ζ\x00)ʌԊ)ʎಪ+8	7ޢ\x00Ζ®΅	\x008*ʌ£ʎƓȴ(1ʉƞʉʁΐΐĤʉǎΐΐĤʉƵΐΐĤ´͸9ͷ\x00ΖȿΖ\x008ʤCˆˆʧ)\x00ʡÄȏͨ¾	\x00ΖĈ\x00΂\r\x00Ͷʌ¶Ζ˱Ηħʌɶ\r\x00*+ˋʌ(+\x00(ÃʉZ\x00(Ãʉô	\x00ΑĘΐá\x00Ιۆ\x00(Ζľ\x00ΖT͹˗\x00Ͷʌ$Ζ	\x00ΑĘΐï\x00ͶΓŀ	\x00ΑĘΐć8	7ಀ\x00Ι༮Ζʁ\x008,ʉ\x00͹ðΖ	\x00Γࢱΐ¦Α\x00ͶʌȽΖ8	7ٿ\x008ʿ'ʴ	\x00ΑĘΐŻ8	7ऄ\x00ΙࠬΓ൴Ͱ(ΐȧԈ(&(ʌΐ\x00()Ζ	\x00ΑĘΐ½(ʌĞʉɨʌຳ)\x00ʢ\n\x00Ζ9ͶΓࢗ\x00+*8	7ˌ	\x00ΖĈ \x00.΁+ͻ\x008ʡဳʉƶ\x008ʡ໙ʡા˄'ˁ	\x00)ɈΖ(\x008ʡӦʴ\x00/Ãʉ޽\x00Ζ®Ό\x008ʴsʤCʧʤ)\x00ΐđʍ߉ýʉຝ(řʉճΐ͸ʉ˼ΐ͸ʉƴΐ͸´Ͱ(ΐɂԈ(&(ʌΐ\x00ΐđʍ෽\x00ΙվΖ\x00΂Γŀ\x00ΉΓŀ8	7ຎΙഩͶΖ	\x008ͺ)ţͷ\x008Kʡ૆ʴ'ʻbˑ	\x00(Γ˚Ζʌ̖\x008Ά\x00ʢ\nΓॳ\x00Ιڒ\x004ʉГ\x00+Ͷ,ʽʤʡЅ)%Ͷ¡ʉǆ	\x00ΖT(**Uͺă(r)Ⱦƥ¢ʵʌϮ£ʵʌԸƬʵʌʉǅʵʌ϶ǌʵʌപêƥþ̄ʌˑæ̄ʌҍȒ̄ʍืɜ̄ʍ๐Ȁ̄ʍۻɚ̄ʍޖƥɍ́ǷƌȢ́ȋƌȃ́ǻƌȌ́ʍ૥Ⱥ́ʎҊȴ́ȅƌȚ́Ȃƌȡ́ȉو	\x00ΑĘΐø8	7ऒ8	7ࣵ	\x00Αłΐ×8	7Ԏ\r\x00Ζ9Ιӂʉ಺ʉʕͼ)	\x00Ͷʌ¶Ζ)8	7࠵\x00)ʌ$(\x008ΗʉƦ\x008Ζ8	7ࡡ	\x00·ʲΈ+ͷ\x00Ι}NʉĆ4ʉL˹ʌȼ0ĚΖ\x008ΖÄ\x00(\x00Ιާ\x00ͶðΖ\x00+ʉżΓŕ-ʉǋ	\x008,+ʌ!\x00-[È,ʌ߰ġ,ʎϷ,ʎПě຾,ʓףƁΙ଎\x008*9ʉŴ\rˊʌѪˍʒโ,ݚ-n8	7൮	\x008ͶyZ×	\x00ͶĎ(Ď	\x00*̈)\rʉհ8	7ಜ\x00ΖΖΖ=ʉˡʉҌΖ΢ʉை\x008+\x008ǏΖʍυ	ΐĤΐʌ!	\x00ΓࠞΐųΑ\r\x00(̉Ζ0+ʉɕʉȧ\x008ͷJ(8	7ࡅ\x00ΖȸΖ	\x00ΐ;ΖΗ	\x00Δˍʌǃʏங	\x00ΑĠΐŦ8	7ཇ	\x00ͶĶ(Ă\x00ΆΓŀ\r\x008ͿͿ2˹ʌӔͿ\x00)(+E\x00(̉Ζ+ΐưΑ\x00ΘΗ(\x00ʢ\n'\x00Ζ®ͷ\x008Kʬsˍ˒bʿ\r\x00Ͷʌ¶Ζ͸ǙΗ)\x008(_Ͷ8	7ء\x00͸(\x00΀5˲Ͱ\x007ҵ	\x00ΑĘΐí\x00(Γ˷ʉच\x007६\x00+ʉ৅,\x008*IʉŖ\x008̅\x00(>ͻ\x00)[ľ΄ď΃P\x00Ι๟\x00)(³Α8	7ۈ\x00΃;	\x00ΑĘΐİ8	7౔	\x008ΘÑ9ʉү	\x008*+ʌ!\x00ʡ३Γ˷ʉȭ\x00΅>\x00ΐđʍ୧	\x00(ΐΐĤ´	\x00ͷȿȺΖ)\x008˒Gʡۨˑʿ)\x00Ζ(\x00Ͷɕʎڄ8	7ࣦ\x00Ͷ|)\x008ʻ'ʴ\x00ʢ\n	\x00Αťΐ\"\x008ΖʉƦΙ౳ΖěΖn\x00)5ʦÕʌʹ\x00(ΖʓࡩΖʎ̥	\x008ʉ޼Ζ4	\x00ΑťΐÕ	\x008ʉҭΖ4\x00Ι}Nʉ4ʉNL˹ʌಇΖ\x00Ι͇Ι̅ʉࠍ	\x00ΑĘΐŊȴͶ͸8	7̡\x00Ζ=ͷ\x00-ʪʌˈ\x00Ͷʌஈ(\x00͸ɕʍ۱\x00(Ζ&(\x007ॷ\x00ΖĜ(\x008ʡԶʤCˉ&ʰ)\x00͸ǿ\x008*(\x00(*ʌȃ	\x008,*ʌ!\x00*8	7ے\r\x00(,Ǹ(,ࡸ+,̆\x00+ʉżΓŕ1ʉǋ\x008ΖÊ*ſΐĽųΓএΐŭΓ๖ΐ̵\x00+,ͶƸ͖ĩ\x00)*\x00͹>1*DΐĽŻΐĽĉΐĽĸΐĽĎΐĽňΐĽĶΐĽŀΐĽ	\x008ʉ྆ΖN*Ͷ)ȫĿΙ࡬*N*ē*Ğ\x008ʡ˘ʬ\x008*ʉฅ)Ңʌ˴	\x00(ͶʌΖ\x00)(8	7ਾ\x00Ͷʌ$ʉԞΖ\"ʉȹ\x00Ζ0)*ŋ̉)+ʉเŶ͹Ƈͷħ(P	\x00Ș˹ǽͳ\x00Ζāʍ(ĆĐǰ(ʉϚ(Ζ(ΙЁΗ(͹ʡ˩ʡఛͷE\x008Ͷ	\x00Γད(Γ༗ΐ)Γؼ\x00Λʅ)ʃΑǬ\x00ͻ(\x00ʡఈʉȭ\x008Ͷͷ\x00(ΓǊΖ\x00(¥\x008ˆȻʮʰéʧ	\x00Ͷyʡލ(\x008ΖÄ\x00ͷ͸\r(\x00Ͷ|)\x00(ʉÀ\x00Ζ9+	\x00ΑĘΐġȗʵʎʹʵʌǥ&ʉǉͶ࿪(n\x00ʢ\n8	7̻\x00ͶAΖA:(8	7഍8	7གྷ\x00ͼǿ\x00(ΐĽ(\x008,\x008*\x00)Ͷ\x001Ϳ+ͻ\x008ǏΐÙ	\x00Γਗ਼ΐ§Α\x008ˁ'ʻ\r\x00ΖΖΖ=ʉɒʉׇΖ॑8	7૛8	7௚	\x00ΖΖΖ৚Ζ\x00,>\x008ͷ9ʉѶ\x00)̞̞āΖҧƪƫƯȟƍİʡ˩ĸùÿɂ/Ǿʵʍࠔʵʍ҉ʎভʵʍ҉ʎ๑\nĸ(ʵȄබ(ʍ඲(ʍёʎ್(ʍёʎ࿢ʌ̘Ǳ)n\x00͹*\x00),y+-),y+Ͽʉඅ-),y+՞ʉľ	\x00*Γ؟ΓƩ)ՓΓࠓ8	7઴\x008)ʎݪ\x00ʢ\n\x00ʡÄʌ଍ͭ¾8	7՜\x00ΖĥA\x00Ι}Nʉ4ʎຉΖʌৢʉ׈ʉX¢ʵʌϮ£ʵʌԸƬʵʌʉǅʵʌ϶ȕ̄ʌˑȦ̄ʌҍǌʵʌذ0ĚΖ8	7܏\x008ΖʉҐ\x00ʢ\n$\x00)ʵʍɻ\x008ͽÒ\r8Ξȶ8ீ787૊\x00ʢ\n\x00()Ζʌɳ)\x008ʡÝΗ%΄ʣʉƄ\x008ʡແʡਜ਼ʡӞʡ̽\x008)Ö\x00΁\x00Ζĥ	\x00ΔʌǴʎA	\x00*)ɱʌǖ)дʌ!	\x00ΑĘΐƇ\x00),y+ʵʍ),y+ʉǠ\x00-	Ι͇Ι̅ΖΗ)\x00)ʡĥ8	7උ\x00)-)ٛ-)୷-)ވ-)˿\x00(Ҕ\x008)ʌခ\x008)÷͠\x00ͷ(*ŕΐĽŴΐƢħΐĽ\x003ʉ଼\x00Ι࢏Δ*\x00(Γѱ\x00Ι˄.෼\x007Ȣ\x008)ʑ९\x00->͟(\r)ଇʇʉࣲ*عʌ૤)ƛ\x00(Ιϯ	\x008+,ʌ!\x00(Γۭϧ	\x00ΑĘΐÏ\x00·;\x00΃	\x00*5ʇ(ʌü\x008\x008ʳDʡģ8	7ׄ\x007෧\x008(ծ(ʌཔʌģ\x00ʢ\n	\x00ΑĘΐľ\x00ͷ)	\x008(೶ˍʌŸ	\x00ΑĘΐĂ\x00ͶĔ(\x00ʡÄʌΕͬ¾\x008ʻ'ʿ\x00ΖT×\x007ॱ\x008;ýʉϺ(řʉ˼ΐ͸ʉƴΐ͸´8	7ࢣ\x008ʹʡǶ\x00͹¿Ζ\x00Αł×\x00ʢ\n̢)\x00Ά;	\x00ΑĘΐſ*ÑΐĦöΐĦÕΐį\x00ʢ\n8	7౮	\x00Αłΐě\x00Ι̜(ʌü	\x00ΑĠΐţ\x008ˇʮ\r\x008,,ʉ̓),yʌڢ\x008(\x00Δ5˥(\x00)ʉſ8	7ঊ	\x00ΑťΐÚ	\x00΋ʲΊ+ͻ\x00ͷΗ	\x00ΑĘΐü\x008Ζʉ҂	\x00ΑĘΐ¸\x00,*\x008Ǐ(Ͷʒ୞Γߟ8	7ઁ\x00΂ƀʉW-ɿ\x00)[ľΉĎ΅ŃΆĂ·ŀΈP\x00ͼͼМ\x00+ѻ)Ώ)ƛ\x00̅ʌ¶ʍԔ,ʌɶ	\x00Γ୿ΐŭΑ\x007̨\x00Ζ\x00(Ιƕ\x00Ζ=Ͷ\r\x00ȗʵ*4*Ŀĵ\x008ʡ̇ʰ\x00)(ʌʚ\x00ΐđʍൠ\x008(2΀\x00ʢ\n\x00͸;	\x008Ǹߔ*ʎϽ\x00-။˼ʌ!\x00+ɘ*\x00()ͺؘ͸5˫ΐχȀԺ%Ͷ਍(n\x00ʡÄʌœͥ¾ýΐΐĤʉƵΐΐĤ´\x00ͻΖ(	\x008*ʌ£ʒ˦\x00ͶʌîΖşʉÁΗ\"ʉӸʉ3Η\"ʉÚʉ3Η\"ʉÍʉ3ʉƿΗΓ૞\x00+ʉżΓŕ/ʉǋԐ\x00Ι}Nʉ{4ʉǜĳΖ¾Η0ò\x00Γ௴Ͷ(\x00(Ͷĩ\r\x00+ͷ*,Ԭ*,E\x008µʷʳ&ʰbʡƲ\x008ʧʴCˇʡࢴ\x00Ά\x00(Ͷ)Χ\x00(ȖͶ\x00(Ιূΐ\x008΀	)ʌ«ʉȞ)ଓ\x00ͶΓदýʉۗ(řʉƴΐ͸´\x00Ζ=͸\x008ΖʉƄ\x008ˑ'ʡť\x00Η͡ΖʌvΗ\x00*;8	7ق	\x00(̉Ζ+ΐ\x00Ιฝ(ͶʌÙ(෺\x007څ\x00(ÃʉZ	\x00))ȶʌƔʌɗ\x008ͷ	\x00ΑĠΐū\x00)Γ߱	\x00ΑĘΐù	\x00ΓౖΐœΑΓٜ)*ΓЏmΓνrΓεÙΐė͒Γ࠯ΐڴÃΐĦ¶ΐĦąΐĦ	\x00ΓࢌΐŢΑ	\x00ȗΖʒÐ!\x00(Ҕ1\x00Ι˄.[Nʉ¹4¤Ê+ʏుġ+ʎϷ+ʎПó+ʌɣɞ+ʓɣÄʔࠟ+ʐඟ0ò[*·ΐĽùΐĽÿΐĽĂΐĽćΐĽëΐĽÞΐĽÔΐĽíΐĽüΐĽßΐĽ»ΐėÆΐĦãΐĦèΐĽ\x008ʰ'ˍ\x00Ζ®΋\x00͸Ζ	\x00(Ζûʍ͆\x008(,ʽ\x00*Ϳʌʚ\x008ͻJʽͼJʽͽJʽ	\x00ͷ()˶*	\x00ΑłΐĲ\x008KʷG˄&ːʡÎ	\x00(Ι࡟ΖǄ(\x008.ळȎ(\x00)ʵȄí\x00ͷ(δ\x00ΓວΗ(	\x00Ͷŀ(ŀ8	7ਛ\x00ΓࢵΖΗ\x00ΖVͷ\x008ͷ	\x00;ΐĵʍ๸\x00ͶD;	\x00ΑĘΐŃ\x008ʧDʡƲ\x00,̃.\x00;(	\x00)Ζʌ(	\x00ΑĘΐď\x00,	\x008ʉВΖ4\x00Ζ®·\rȼΐʌ)ΐĤ)	\x008ʉ૓ʉর(\x00ʢ\n!8	7ܭ+\x008͸	\x00ΑĘΐŰ\x008ˑ'ʡÎ	\x00ΑĘΐè\x00ͻðΖ	\x00ͶǈΖĜ(\x008ʻ'ˍ\x000΃+ͻ\x00ͼ;\x008(C(ʌ«ʉĳ(ʌ«ʉǠ\x008˄sʹʡ຤ʿ8	7ཿ\x00΀ΖĂ8	7୑	\x008͸\rʉ༰ͷ\x008*IʉƝ\x00*()E\x00Ζ5̟Ζ8	7๙	\x00ΑĘΐŀ\x00,Γ˷ʉԖ\x008ʹʢ\x00Ι}Nʉ{4ʉŁ0¾)˫\x00ʢ\n \x007Ҭ͸ǻ(\x00ΐđʍ۹\x00ΙվΖ	\x00ΑĠΐŞ\x00)*ʌུ\x00Ιഌ\x007ఋ\x008ͶyZʉࡵ\x008)Ѯ)ʔ\x008*ͷ)ȫĨ3\x00Ι}NʉĬ4ʉ@Ɂ(ʔઘȔ(ʐদ'̀ʍʬt̀ʌˣ7̀ʌӋ+̀ʌձ0ĚΖ\x008Δ\x00([Ŭ;ź΀uͿ+΀Ă΀ŀͽP	\x00ͶȝΖ(\x00ͽ;	\x00Γ๛ΐÉΑ\x008ʿ'˒	\x00ΑĠΐö8	7୩	\x00.̅ʌʍਵ\x008ͶJʽ&ͺJʽ	\x00ΑĠΐ°	\x00ΖĈ\r	\x008(1ʉ܍ʉ࣐\r\x00(ģ):ʉݦΓѓʉೣ*ľΐĽĎΐĽŃΐĽĂΐĽŀΐĽ\x00Ϳ;\x008ʿ'ˇ\x00΁;\x00ΙൌΖ\x008,+т\x00ʢ\n8	7ྶ	\x00ΑTΐĺ8	7Ƿ\x00͹|(\x00Ιץ\x008ʵʌű8	7ट	\x00ΑĘΐë\x00ʡÄʌĪͩ¾\x00ͻʵʌǥͲʉǉ\x00Ζ®ͻ\x00ͺðΖ	\x00ͶΖǘ\x008ʴ'ʿ\x007ं\x007ӱ\x008ˑʡÎ\r\x00Ζ9ΙӂʉࢽʉÇͽ)\x00Ͷʌ$ʉЙΖ\"ʉǠ\x008ΖIʉԠ	\x00Ͷĩ*³Αο\x008)ʏ̧\x00Ͷʌ$Ζ˗\x00Ι͇Ι̅Ζ(Ćࡎ΂\x00Ι෈Ζ¾	\x00+*) ĩ	\x00ΑǼΐŴଷ\x00(ΓݕΖ	\x00ȗΔʍΙ\x00Ζĥ8	7ග\x00ʡÄʌŚͯ¾\x007Ս\x00(ΖDМ\x008ͶyZʉ๪	\x00ΑĘΐÞ\x008Ϳ\r\x008((ʌ̳ʍঠʍϟ8	7࣫\x00ͻ|(\x008ǏͶΖE\x008ͺͺʌ«ʉô\x00Ͷ|×\x007ҡ	\x00ΑĘΐÓ\x008ͻ\x00)\x008ʰˇGʹˑ)8	7Ȁ\x008ΖJ͸8	7ఫ\x00ʢ\n\n	\x00ΑĠΐź8	7ࠛ	\x00ΖĈҒΓహ	\x00ΖĈ\x00ΐĤ(\r\x00([ĐΗĐšʡഝ\x00ͶͷɡΗ	\x00Γ๠ΐŝΑ\x00Η͠ΖʌvΗ	\x00,;Ԧͻͻͦ8	7ఄ\x008ʡ̇ʹ\x008Ζʌ࿩ΖʌཐʌրΙر\x008˒ˁ\x00);\x008ʡח˄ʤ'ʢ)\x00΅;\x00)ͷƙ(\x008ʻʷCʿ&ʡϔ\x00ͶʌîΖşʉЙΗ\"ʉΗ\"ʉÍʉ3ʉƿΗ	\x00ȗʵʎēȣ	\x00ΑĠΐÆ	\x00ΑĠΐÑ\x00͸(ໍͶ(আͷë\x00(\x007Ŭ\x008(_ͶȲ\x008ΖΎ˩\x00Ͷ¥\x008͸\x008ʡކʴ'ˇbʰ	\x00ΓѬͺͷʉȭ\x00)ѻ\x00Ιூ\x00Ι}Nʉ{4ʉĪĳΖ¾Η0ò	\x00ΑĠΐą\x007౪\x00+;\x008ˆGʴˁéʷ\x00(ΙڌΖ8	7ཡ\x008͸И\x007஋\x007Ҏ\x008ʡÝ)%(ģ+ʉ෋ʉǽ	\x00Ͷʌ$ʉƿΖ8	7ŉΐʉЛʉગΐŤʉۓ\r\x00)Γ௟ʵʍՂͶ͹#ͷ8	7֜\x007ຄ\x00)ΐĤ8	7࿙\x008ͷJ(஦͸J(ဖ͹J(ͪ	\x008*ʌ£ʏh	\x00ΖĈ	\x00ΑCΐÈҒΓ౫\x008*ͷ)ȫĿ8	7ʷ	\x00Γ྾ΐÂΑ\x008(_ͷȲ\x00ʣȤ(\x008*=͹\x00Ͷ|Ζ\x008ͼ8	7ਂΓ֕\x007ޛ\x008ʡ˺ˇCˉDˍ)\x007ђ\x00ΐđʎြ\x00Ζ&(o̞̞āΓ˂ΐɞİΐĽDΐĽśΐĦŠΐĦŊΐĽűΐĽƅΐĽŰΐĽŦΐĦŨΐĽŀΐĽŒΐĦōΐĦţΐĦŞΐĦūΐĦŷΐĦѥ\x00ͽΖʍ̥	\x008͸\rʉ෉ͷΐʌ)ΐĤ8	7୎	\x008))ʌి\x00͹(ͪ̃(ʉŪ\x008ΖJ͸Ȳ\x008µˍGʻD˒ˉ\x00Ι޶)(Ĳ\x008(	\x00΂ΐĵʎϐ\x00*Ιප΀ʌͩǸׯ΀ʌͩʍൣ+n\x008Ζͷ8	7ٶ\x00Ι̜Ζʌü\x008ˇDʡÎ	\x008ΗKȎ(8	7֧\x00ͷ\x00ͼΖʍභ8	7୻\x00ΖVͶ8	7঍\x00(̉͸+ʉɕʉȹ\x00)>\x008˒ʡϋʢʻ)Γྼ(\x008*,ʉŗ\x00Ι}Nʉ{4ʉAĳΖ¾Η0ò\x008͹ŞͶ੦ͻΔE8	7ཪ8	7௦\x008(2Ή8	7۽ΐΐĤ´\x00˷ͻ	\x00ΑĘΐÔΓஓ	\x00Α8ΐĐ\x00Έ(\x00ͿΖ\x00ͼðΖ	\x008ʉడʉ૮(\x008ΖIʉࢀ8	7ઞ\x00Ι}Nʉ{4ʉƢĳΖ¾Η0ò*ǡΖ˨(ΙЁΖQ(ĳΖ3ģΖgķΖښ\x00Ζ˹\x008΂Ò\x00ͻΖʎɻ\x008ˉDʰ\x00ʡÄʍ`ͧ¾\x00ͻ;\x00*)ʌ౷)ʒ࣡)ʔՑ	\x008Ͷʌ«ʉ\x008˫\x007˧\x00(Ζ\x00Αʌܐ8	7޸\x00(ɝͶ\x008ȍΖ\x00Ζ9Ιຖʉґͻ)\x008ȍΗ\x008µʮCʴ&ʡഁˑ\x008*I(\x00ˤ5ʇ+\x00΄ɉΓĝ΂\x00.¥	\x00ΑĘΐň\x007௤%*ŢΓ۪ΐŲΓज़ΐœΓ௠ΐŝΓۚΐĺΐřΐĦ\x008ʴ'ˉ\x00/Ãʉſ	\x00ΓೆΐzΑ8	7ٗ\x008ʿCʡଘʬʡ\x00Ιང̤Ζ)ΐ͸´\x008Η2ʽ	\x008*ʌ£ʑ཭Γ۞Λ෤(n	\x00ΑĘΐD\x00ʢ\n#\x00ͼ.Ζ\x00ͶĔΖ	\x008Ϳ*Ŀ؆(ൖ)P\x007ࠑ\x008ʻ'ʬ\x00ΑǎΖŏĺͼĐΗĐ»8	7ۣ\x007࿘\x00ͶŻ;	\x00΃ΐĵʍ၈\x00)͸\x00ʢ\n%	\x00ͶɊΖċ(\x00(Γь\x00Ͷʌ$ʡºʉ੒Ζ)\x008ΗʉҐ\x00Ͷʌ¶ΖΓھΗ)\x008)Şͺ!Ń*jͶ6+Ͷ*ඒ+ƶʡÝ(%+ƶҾʉล͹ĺ་Ͷ*˝\x00ΐđʍࣧ\x00(ʤʑຜ\r*ľΐĽďΐĽ	\x00ΑĘΐŨ	\x00ΑĠΐÇ\x008˄ˑ\x00΀(\x00(ͻΖE\x00Ͷʌ$Ζ\"ʉÚʉľ\x00)*ͶȴΐΐĤʉʁΐΐĤʉǎΐΐĤʉƵΐΐĤԨ\x008)(\x008ͷ9ʉɔ	\x008ʉ໗Ζ4\r\x00)ͶΖ*ԬΖ*E\x00͸>\x00΄Η\x008(,ʉÿ\x00ΓྜΖͺ\x008*Ŀ	\x00ȗΖʐǟ!Γ়	\x00ΑĠΐã\x008ˑ'ʳΓ݋\x00ʢ\n8	7͘*zΓۛΐ¸ΐĽÓΐĽäΐĽøΐĽ\x00(Ζǘ͸ʌਉ(n	\x00Γ࣬ΐÅΑ\x008ʬDʡ\x008)ʉƦ\x00Ώʲˈʡ͐Ζʍ࡜*ʉకʡ͐Ζʎܿ+ʉྮ(ʎФ\x00*Γ׵)	\x00ΓٹΐÙΑΐ͸෯ʉǽ	\x00ΑĠΐK	\x00ȗΖʓઅ!*ŬΐĽźΐĦĂΐĽŀΐĽ\x008Ɂ*?ʡ୰ʶ_ʉZʡരͺ)u)+*ë\x008ΖAÒ8	7໅\x00ʢ\n\x00ʡÄʍÐͮ¾	\x00Γ౐ΐÀΑ\x00Ζ9ͻǦ\x008ʡʡˑ\x00Γหͱĵ\x00(Ãʉô\x00ͻĔ(	\x00ΑĠΐś\x008(̞	\x00Ͷ*()E˸˻̈ʌʰΖ༿\x008͸͸ʌ«ʉŴಊͷ୴ͷ$଑ͷ$2ʌ׻(ͷ$౩(ͅΖT(A	˂ʌ̴(A:ʉѝΖT(K	˂ʌ̴(K:ʉѝΖT(3˗)(ì(ì3ڐΖT)*(z(zz	(zzëΖT*+(z(z¸	(z¸ëΖ8+,(À(À	(ÀëΖ8,ě-n8	7غ\x008(2΄8	7ָ\x008ʹ'ˍ8	7യ\x007˃\x00Ή\x00(ͶʌΖǄʌ٬ʌƔʌɗ\x00Ͷ;	\x00ΑĘΐĎ	\x00ΑĠΐŷ\x00Ζĥ\x007֍Γ఍\x00ͺ|(\x00ͷ|(ĵ\x00ʡÄʍÁͫ¾8	7গ\x00Ζ9,\x00-(,E	\x008)Ζʌ!\x008ʡвʬGˍʤ)	\x00ͶƵΖKǘ\x00(Ãʉŗ\x008ˁCʹˍé˒8	7ݾ\x00(Ͷǫ(8	7ৗ	\x008K͸&Ͷ&ͷ\x008*IʉZ\x008(_ͷ8	7ࢤ\x007ݹ\x00+)ࣈ)ʌ߮ʉZ\x00,ʡЅ͸͵͹	)%ͷଔʉǆΓ఩8	7ڳ8	7வ\x00Ζ®΍\x008.8	7༤8	7ံ\x00),),yʌॲ\x00,\x008Kʉબ(	\x00͸Γӭͷ(\x00΄(8	7ऺ\x00ΊɉΓĝΉ\x008ͶʌΐΖ_ͷ\x00,ͺ(E	\x008*ʌ£ʔʛ	\x00ΑĘΐű	\x008(1ʉজʉƦ\x007ҏ	\x008,(ʌ!\x008(1ʉ๫\x00ΙєΖ5\x00+[A*3*ֈʡɦͶ\")uͶ\"+))±Ͷ±K̏*uͶƋͶƵศ\r\x00Ι}Nʉá4ʉâ0ò\x008ʡʡʷ	\x008͸\r(=ͷ\x008+̏ơ̎ʉ̍+ʉżͼ+ͻॏ8	7ނ\x00ΖΖΖ=ʉȵʉ༚Ζ΢ʉƾ\rʡ঳Θ%Ζ̃ʉݠΗ%Ζ)\x00Λʅ)ʀΑȇ\x00ΙนΙ๗\x007࠘\x008͸9ͷ\x00Ͷ¿Ζ\x008ˉCˆʡǀʡ˹	\x00)Γ࿓ΓƩΘ)	\x00Αʌ$ΐĽĐ\x00ʢ\n̣Ι೫\x00΂ǟ(\r*ŕ-Ŵ.ħ/P\x00*(ɯ(ව\x008,2ʽ\x00*Η\x00(ΐ͸´\x00͸;	\x00(ˍʌǃʡ૏!*Ţ͹$Ųͺ$œͻ$ŝ(ĺ΁řͼ$\x00ͶDŬ	\x008(Αʌ!\x008˲8	7໻\x00(Ãʉ	\x008ʉොΖN\x007඾\x00ʡӒʰʌѐΐ͸ʉƴΐ͸´ΓࡈĂ,,+,tˤ,*&ӈ\x008͸ධͷ	\x008*Ͷʌ!	\x00Ͷň(Ń\x007ක\x00Ι}Nʉä4ʉrØΖ0ĚΗ	\x00(ʌ$̈))	\x00ΑĘΐÿ	\x00(̉Ζ+ʉȧa*Γ୵ΐÐΐċñΐĦΐĽïΐĽÇΐĦÏΐĽÛΐĽåΐĽ«ΐĽáΐĽýΐĽòΐĽÚΐį½ΐĽÝΐĽ	\x00ΑĘΐ\x00(ɔʉԲ\x00΂ǉ(\x00͹Ĕ(\x00(šʡĥ\x007ˋ\x00)ʌ$Ιസ\x00(Ζʌ঩ΖʎՖ\x00ʢ\n\x00ͶΖွ\x00(Ͷƙ(\r\x00ȘͿ*4*Ŀĵ\x00ʢ\n\x00ΐΛഡ\x007ૃ\x00ΔΖĳ\x00͹>\x008(,ʉÀΓ֘\x00-ʉÿ\x008µʡѾ˄'ʧbʻ	\x00ΑĠΐŒΓ੢\x00Ζ®Ώ࠾ʉҌΏ8	7ڠ\x00͹;ΔΙ཯ʌǞ͹˿ʌ¶Δ̙Ζ)̆'ʉ੾(ଙ\x00Λʅ)ɾΑǨ\x00-΀+ͻ\x00ͼ¿Ζ	\x008(Ζʌ!\x008ʡ࿂ʡ෩ʮDʰ\x00-ʉZʑ࿆ΐ\x00Ι}Nʉ{4ʉźĳΖ¾Η0ò\x00/8	7໚	\x00)̃(<ʉŪ\x00(ʉZ\x00Ε\x00(Ͷʌ!\x007ඣ8	7ঘ\x00(Ζʍυ	\x008ͷʌ«ʉŗ\x008͸Ò8	7ƫͶ\x00Ͷʌఓ͸+*,-ΛΜ./'() !\"#$%&Κ	\n\r čƄÍ%Ä²B:¯ĉ­ĉ>ß!ċÉĉ©ĉĈ£¼ý`[=ò¹âj*ĉ¢8¹$\rþ¹t<b15ĉEĉf\\e4ĉÁY¡ĉ÷ĉe4hăĄpIĉÁYāĉ#Ą (aÃ¹ çĉF¥Ą|T´ºùZÑ]ÖĄ®¤IĉÑĉÊ7ĉÝĉĉD¬^J~õĀrÏyéNC-9¶³K½SĉPØ§ćËăĄpIĉÑ]ÖĄ±¤IĉÑĉe{îĆ¹jĉÀ@_;Ăª)Ì&L»U¾\nüàzë/ûăĄpIĉÁăĄqpIĉÑĉeÊĉÁÝĉäĉíwĉ«ĉô\"ñöúdWÕÔèãåÎï0¦êoâĉ,ĉiĉ2ĉø6cá|×ĉ¸ąHµĉø'ÇÓlÅĊĉmÒXóĄRÂĀM÷Ðnam¹RæĉQ·ĉsĉsĉÆÙÛÜO¼¹k3}¨ÞVGÚ	vČx ¿AÈg+°ìð\x00.?ĉÿĉĉĉuĉ\x00č\x00,ʹ'˒,	+஄\x00'	\x00ȣʵʎҺ\x00ͿΖĽ(\x00Ζ(\x00;ΖĽ(\x00ĝʔ\x00Ι࿔',	+ય\x00+Ȣ	\x00!ȫ ʔ̪	\x00,ˍΚȂʽ\x00+ഴ,	+ญ	\x00ΔʌǴʌą	\x00,Ͷʌ!\x00˿ʌȽΔ	\x00&ȓ%ʔʟ\x00´h+̍:\r:\x00ͽΖĽ(\x00͸\x00+࿞,	+ۅ	\x00ˍʌĹȍ\x00;\x00[NΖ4Ηǖʌ฽	ʌ໐0i\x00\x00ΖĘͽ\x00ʌʚ,	+౏\x00%'\x00Ι๞\x00,ʡ๜˄	\x00,ʵʍɼ\r\x00,ʡÏʌ'ʏປʉh	\x00ˍʌĹǽ\x00ʢ\n\x00,ʍՔʌ!,	+ળ\x00ͶΛѯʎMͶ\x00¥	\x00΀ʲ'ʍؕ	\x00&þ%ʌ߲*~Ζʍࠆ¨ΖʍරîΖʒཏΖʍޘ\x00#',	+ഈ\x00,ˇDʡť\x00,ʡׂʡĒ,	+ୃ\x00ͽΙƕ\x00,ʉໟΗ&ʉ͚ΗĻʌӔ\x00ΖĘ͸\x00ΖĘ΀,	+̡\x00ͷ¿Ζ\x00,Κjˍ\x00,#ʌಸ\x00ʢ\n\x00,ʍ྅,	+௶\x00,ʳDʴ\x00;ʲ'ʍ໶ʉǆ\x00Ι}NΖ4Ηə0Ě',	+ཨ	\x00&ɝ%ʏပ\x00ʢ\n\r\x00͸Ǳ\"ȁ੟\x00ΖĘ;\x00΀ΖĽ(\x00,(\x00\x00,Θ\x00+˧	\x00ȤʵʎΉ\x00Ɍ[ȉ$ʌ˻ʎʉȵ$ʌ˻ʒ࢙Ȅ̕$ʌ˻ʍ೎,	+Ȁ\x00ͺ\x00,\"ȁí\x00Ιө'\x00Δ5\x00͸\x00ͺ'\x00,\x00+ྏ\x00,\x00ĝ\rƦ+ʉ՝ĝǦ	\x00Ʀ+ʉZ\x00Λ͋\x00͸ΖĽ(\x00,ʰʡࠃʡǀʡ˹,	+ం,	+൤\x00\x00,ʡ̇ʹ\x00'\r\x00,&,ʐࡣ,ʒτ\x00+ˋ\x00,KʤsʢˑʡÎ\x00,ʻ'ʡģ	\x00Ʊ+ʉZ\x00ΖĘͷ\x00ͽ	\x00&ȸ%ʔҗ	\x00ΖTͶʌü\x00ΐΛன'\x00+Ŭ\x00čδ\x00,ʮsʡٻˍʡ˹\x00,'\r\x00Δʌȇʌąȷͻʌ΀\x00Ϳ\x00;	\x00Ͷ ðΖ\x00!\x00Λ౺'	\x00,Κǹ˅ˍ	\x00(ΓƩ'Փ\r\x00,%ʍڊʏ࡝%ʍʍ\x00Μਡ\x00&	\x00!ɖ ʑˈ,	+ߺ\x00,ʻ'ː(,	+͘\x00 '\x00ͷðΖ\x00ǲʍ୪ʍފʌթ	\x00!Ȏ ʎѩ,	+ּ\x00$'\x00Ȼ\x00ɒʉॆ	\x00ʍՔE,	+ŉ	\x00ˍʌĹǺ\x00)Δ,	+ௗ,	+༱	\x00ΖĘͶ̆\x00ͷ\x00,ʡଆ˄ʡܗʡͭ	\x00Ͷ ¿Ζ	\x00ˍʌĹȐ\x00ΖĽ(\x00Δʒॵ\n\x00,\x00,ʡಯˁˉː	\x00ɖʉі'(	\x00˖ʌʸȃĐ\x00+̨\x00ΖĘͻ\x00Ιܷ\x00Ι˄'	\x00,ΚȈ˅ˍ,	+׼\x00ʢ\n\r	\x00ΔʒѪ	\x00&¯%ʍʍ\x00ͻΖĽ(\x00Κʌƾ\x00ʍα'	࿱\x00;	\x00,(ʌ«ʉ,	+ٍ\x00,ʷ'ʬ\x00[čʌॗĝʌਭƱʌˑƦʌੋ\x00˄\rʉʆ\x00Ǿ'6Γͽ'Γްʌ«ʉЈҴn\x00ΖĘͿ\x00Ι຿ΔʍৰΔʍৈ	\x00ͶΖĽ(\x00Μ×	\x00&æ%ʌή	\x00Ͷʌ$ΖĽĐ\x00ʢ\n\n\x00,$ʌౝ	\x00,(ʌ«ʉŗ\x00Θ(\x00ɟ[Ȅ̕#ʌˢʍಾɋ#ʌˢʎߚ#ʌˢʎଊʌଽK¢'ʌ!t'Eʒ࢘൏ʌØʉ॔ɑ&ñ,Bڍ'Ļ6͸ɖơʍŵǱn\x00,˄ʮ,	+ƫ,	+ӻ\x00Ιө\x00,,	+ϛ+\x00ʌŨȘʓඬčǝĝϞȞʓ٘Ʌʒ൸ȯʑࠌțʎ๲	\x00&ȹ%ʑ̒\x00,ʡՕʡ੯ʮDʿ\x00ͷΖĽ(\x00,\r\x00,ʡÏʌ'ʏຆʉh\x00ʢ\n	,	+྽\x00ʵʑ༘ʵʑࢇʵʒϊ\x00́	\x00&ɉ%ʏ̒\x00Λӧ\x00Ͷ¿Ζ	\x00ΖĘͶʌü\x00\x00ʢ\n\x00,֎ʌЖʌ˙ʌЖʌࣉ	\x00!Ȑ ʔű	\x00ΔʌȇʎA\x00Ͷ¥\x00'Λ͋'-\x00[ȗ́ʎҊȿʌˁʌʢʔઝɐʌˁʌʢʓֵǐʌˁʌʢʒཱི\x00͸ǔʌ༬\x00hʡºh\x00,)\x00Δʓ૧\x00,ˍˉ\x00,ʡநˁ,	+ං\x00'ʌࢄ\x00ͶðΖ\x00č\rƱ+ʉ՝čǦ\x00Ϳ'ʍౘ\x00,ʉࡍΗ,	+༛\x00΀\x00E\x00ͶÍ(\x00Ɉ͸ǋʓආ	\x00ΔʌǴʌą	\x00ͷΛѯʍõͷ,	+ʐ\x00\"'\x00;\x00\x00,%ʎɈ\x00,Kʡಌʡݜʬ&ʴ,	+΃	\x00ȳʌ;	\x00ɇ%ʎɈ\x00,KʬȻʡಈʤʴ\x00,'ʍఽʵʍȃ\x00,'	\x00ʲ'ʉɜ\x00, ʎѩ,	+ݳ\x00ͻ\x00,͹\x00,)&)ʌØʉƶ\x00h̍:\r:,	+ਲ\x00ȭʎǕʎޣʌթ\r\x00ʌʽʤʔȷʌޟ	\x00,Κǿ˅ˍ	\x00ΙЌΙʗ'ȁओ,	+Ƿ\x00,ˉGʹːˉ),	+࠼\x00,	+ˌ,	+ӎ\x00+˞,	+ൎ\x005ʤʒણŒ\x00ʲȹ'ʉɜ,	+࢈,	+ʷ\rΜΝ\n	&\x00	\n\r\x00\x00ʢ\n	ŉ\x00͸Γĝͷ\x00ʢ\nŒ\x00ʡग़ʴ\x00ͻ;ǾΔʍബ\nʡƧʌΔʍڑʓའ\nʓǃ	Ǳn\x00ͷΓŀ\x00ʢ\n	\r\x00Δʌȇʌąȷͻʌ΀\x00Λӧ\x00\nˍΚE\x00ΕʉࠜͷͶ\x00Ε;\x00͹\n	\x00Λԝʍʻʍۖ\x00Ν×	ƫ\x00ͻʵʍɼͻှͻ\x00ʍФ\x00͹\x00\n_͹	Ȉ\x00ͻΛ༣\x00Δʏ֮\x00Ŭ	\nΝ\x00\r\x00\x00\x00\x00\n		ŉ\x00\nʡÏʌʎ୒Œ\x00Λԝ";}else if(_$$L===54){_$km[6]="";}else{_$lo=0,_$gN=0;}}else if(_$$L<60){if(_$$L===56){_$km[2]="vQTU`PQS`PPX`PP`QTT`XS`QV`RU`T`RQ`TW`POT`PQP`UP`QO`PPQ`TS`PT`XV`QS`POOO`V`PPW`LP`TO`U`PQW`TV`PO`UR`QSO`PU`POQ`XU`PW`PPU`QP`SQXSXUVQXT`UO`PPT`R`PS`PPR`PV`US`TX`POO`W`PR`QQS`POX`PQV`Q`QQ`PPV`PQT`PXQ`RP`PX`TOO`S`PQ`QR`X`PSQ`WR`XO`UT`XW`SV`UOSWOO`XP`QW`TOOO`SP`RS`WX`RR`XR`SO`UW`OMP`TQ`UQ`PVX`PPP`POR`XQ`UU`SW`QOO`QX`POW`UV`TU`QU`TR`RV`UTTRT`RQVUW`PVP`RW`VX`RX`SS`RO`SR`ST`POQS`RT`PQO`OMR`POS`PPS`VW`PQX`PQU`PQR`XX`SX`POV`WV`QT`ROO`PQQ`SU`WPXQ`SQ`QOXVPTQ`OMV`PRT`OMOP`WO`OMW`WT`OMOT`TP`RPVSS`POSWTVU`PUT`PSX`QOP`QST`SQXSXUVQXU`OMQ`QOXVPTP`WU`PTS`PRPOVQ`VP`QQP`PVQ`PSR`LOMP`VU`PRX`SOXU`QOR`PWW`PUR`PUS`TT`PVT`POSWTVT`QQX`ROOO`PRP`PVV`QOOO`PXP`POU`PRSQPVVQV`WW`PPO`VS`SPXSROS`VQ`VR`XT`PRR`UTTRU`PTO`PUW`PST`UX`PURWS`WQ`PVW`PWP`VT`PWO`POP`LPS`QRP`PRU`PVU`PSP`PUVVVQPU`PURWR`QSW`QPP`PXR`QRR`PRQ`PWS`QOOOO`PTR`QQR`QPX`PUQ`QPS`WP`QUTSSRTVUX`VV`QOX`PUO`QSS`OMO`QUQPSS`QOT`PXU`QPW`LOMOP`QPT`QSU`PSO`QOSW`PVR`LPOO`QUWSRTSTT`QQT`PVS`QPO`PRW`VO`QOW`PSV`PTP`PXS`PXT`QPV`PUX`SOXUO`WS`QRO`PUU`PWT`PWX`QUWSRTSTU`WRWWUOW`PTW`PXV`QQV`POQR`PWU`PWQ`TRUWVOXPQ`PRV`QRU`QRS`QTV`PWR`PXX`VQO`LS`PSU`PTQ`QRV`PRS`WQOR`PTUVX`OMXW`QTRPOPP`QTS`OMQQ`PWV`PWOO`WUSOO`OMSU`QOV`SOOOOOOOOO`QTQ`PTT`PUV`OMTP`POOOOO`TPQ`PTX`QRT`PSS`QSV`QTR`PTU`OMSX`QSQ`LQOOOMO`PVO`POOOOMO`PRO`OMS`QOQ`QQO`PUP`UTTRV`PXO`SWO`OMVT`POVRVSPWQS`QPU`QWR`RUO`PUWSROOW`QSX`TQSQWW`QPR`QPQ`QTO`QRW`QSR`QRQ`LOMQU`UMPORTPTUQTnLOT`QVPVRRWVW`RRRVTUTXWS`RXWWQXQRWS`TTQXU`PnLOX`LPOOOMO`PSSO`LXO`QOSV`PMP`RTOO`OMPT`TURQO`LQ`SWOOOOMO`RQWTRVVTQO`QTUQRWRPOQ`USTPQ`LV`TOWX`POOOOOO`QTOO`OMU`ROOOO`XQPUOO`PUVVVQPT`RRTTSSRQ`QOVRUOO`PTPWTOOQSX`LOMOT`PTOO`LOMX`OMQT`LPWO`PUWSROOX`OMX`RRXTSUXVWQ`OMRT`OMQU`OMOU`LOMQ`OMTS`PWTXVVTRXR`QPSVSWRUSW`POQSO`OMOW`LOMT`RQQTU`SOQRQRRSPV`OMWPRQUSTSR`QSOOXTXVOW`PVRQTWSPXR`RPSTVQW`POOP`WUSOOOOO`PWRTOOW`OMPU`RUQ`RSV`RUU`QQU`RTQ`RUT`RVS`QUS`ROV`QVU`RSR`QUX`RRT`QXV`RST`PTV`RRO`RQO`QWT`RRQ`RVU`RTR`QXX`RVV`RSQ`RSO`RVP`RSW`PSW";}else if(_$$L===57){_$km[4]=_$aO(19)-_$ea;}else if(_$$L===58){_$$s(_$km,_$kW);}else{_$ke[_$aE]=_$_i;}}else{if(_$$L===60){_$i3=_$nD===undefined||_$nD==="";}else if(_$$L===61){_$i3=_$gN%10!=0|| !_$lo;}else if(_$$L===62){_$a2.nsd=_$$K;}else{_$kG++ ;}}}}else{if(_$$L<80){if(_$$L<68){if(_$$L===64){_$i3= !_$n4;}else if(_$$L===65){_$i3= !_$ea;}else if(_$$L===66){_$kD=[1,0,0];}else{_$gN=0;}}else if(_$$L<72){if(_$$L===68){ !_$i3?_$lV+=3:0;}else if(_$$L===69){_$kD=_$a2.nsd;}else if(_$$L===70){_$km[0]="mfwgdcbgwHwlh`ywh5hhf{tihw`ghf{by`T`z{vvwb`fwgdcbgwHmdw`g~{uw`xibuh{cb`#`5uh{jwLCt|wuh`dsfgw`hcd`hcGhf{by`sddwbv7z{~v`ywh`gd~{h`digz`bsaw`{bvwlCx`hwgh`ucbush`#BCH_:CIB8. `ywh=hwa`cb~csv`k{vhz`KwtGcu}wh`ghm~w`hmdw`ct|wuh`fwd~suw`us~~`LA@<hhdFweiwgh`~wbyhz`uzsf7cvw5h`ghshig`V`zw{yzh`ufwshw9~wawbh`sdd~m`gwh=hwa`|c{b`dfchchmdw`gwbv`1`js~iw`ibvwx{bwv`&`svv9jwbh@{ghwbwf`3`fwsvmGhshw`vcuiawbh9~wawbh`xfca7zsf7cvw`X`tcvm`cdwb`gd~{uw`ywhH{aw`igwf5ywbh`ashuz`vwx{bwDfcdwfhm`biatwf`zhhdg.`cbfwsvmghshwuzsbyw`~cush{cb`zsgCkbDfcdwfhm`ywh6cibv{by7~{wbhFwuh`Obsh{jw ucvw]`dcd`hsfywh`ywh9~wawbh6m=v`zfwx`gitghf`ywhCkbDfcdwfhm8wguf{dhcfg`fwgdcbgwLA@`{bdih`sddBsaw`ghsu}`u~{dtcsfv8shs`cbwffcf`ucc}{w`gwh`dshzbsaw`fwgdcbgw`zhhd.`ucbghfiuhcf`hzwb`h{awGhsad`usbD~smHmdw`}wmvckb`W`Fweiwgh`\"`p`vcuiawbhAcvw`ucbgc~w`uzsf5h`gfu`cbh{awcih`dsfwbhBcvw`tihhcb`{g5ffsm`vcuiawbh`hc@ckwf7sgw`fcibv`s`gwh=bhwfjs~`wlhwfbs~`fwacjw9jwbh@{ghwbwf`u~{u}`9}uD`9jwbhHsfywh`gwsfuz``Q`cbdfcyfwgg`bcvwBsaw`fwacjw7z{~v`dfchcuc~`ucbbwuh{cb`.`fsbvca`y`cbstcfh`v{j`~cus~Ghcfsyw`_`}wm`ashuzAwv{s`suh{cb`u~wsf=bhwfjs~`hf{a`u~cgw`fwdwsh`]`hsyBsaw`ctgwfjw`O`cihwfK{vhz`cf{wbhsh{cb`acigwvckb`ghsfhgK{hz`sgg{yb`cb~csvghsfh`WW`8cuiawbh`wjwbh`{bbwf<w{yzh`}wm7cvw`ghshigHwlh`<HA@:cfa9~wawbh`fwacjw=hwa`gufwwb`~wxh`us~~wf`vwj{uwD{lw~Fsh{c`~cy`tcc~wsb`ghf{by{xm`{bvwlwv86`xwhuz`guf{dh`fwgi~h`Ib}bckb`bck`Y`(([`9~wawbh`x~ccf`dxxX`ywh9~wawbhg6mHsyBsaw`zcghbsaw`cb~csvwbv`gwbv6wsucb`{`ashuzwg`,X`cihwf<w{yzh`%`{bbwfK{vhz`dwfxcfasbuw`hciuzwbv`P`{bbwfHwlh`w6,+t7X`vshsHfsbgxwf`gitghf{by`awggsyw`gwhH{awcih`u~cbw`$_MJHL`cbgiuuwgg`zwsvwfg`gwhFweiwgh<wsvwf`q`fwd~suwGhshw`hciuzghsfh`cxxgwhK{vhz`stcfh`zsgz`gw~x`/ Gwuifw`zcgh`gmatc~`hciuzwg`wgusdw`vwguf{dh{cb`___HG___`dxsX`$t_us~~<sbv~wf`}wmg`LA@Gwf{s~{nwf`cxxgwh<w{yzh`j{g{t{~{hm`:cfa8shs`gwh5hhf{tihw`d{lw~8wdhz`{bbwf<HA@`ucdm`$_hg`IF@GwsfuzDsfsag`vt~u~{u}`{bhwfbs~`{gBsB`z{ghcfm`gz{xh`LA@<hhdFweiwgh9jwbhHsfywh`hciuzacjw`xcbhg`u`DCGH`wjs~`gwgg{cbGhcfsyw`a`A{ufcgcxhVLA@<HHD`A{ufcAwggwbywf`uzsfy{byH{aw`gita{h`ucaawbhg`acigwid`uc~cf8wdhz`sjs{~<w{yzh`f`l`hwlh`~csv`dcfh`dxtZ_X`xcfa`usbv{vshw`ywh8shs`ibacb{hcf`u~{wbhL`sv`5bvfc{v`dsfgw=bh`/`if~`N;-isZ`)wX*vv-+`sdd~{ush{cbWla~`t~if`Dc{bhwf9jwbh`ywhGzsvwfDfwu{g{cb:cfash`I{bh,5ffsm`:C7IG`tchhca`ucbhwbhUhmdw`\xe8\xb6\x85 )X% \xe7\x9a\x84\xe6\x97\xb6\xe9\x97\xb4\xe5\x9c\xa8\xe5\xb7\xa5\xe4\xbd\x9c\xe6\x97\xb6\xe9\x97\xb4\xe6\xb4\xbb\xe8\xb7\x83`hmdwg`9vyw`$t_gwhid`sjs{~K{vhz`;whJsf{st~w`v,w,x+XZ`|gcb`wlwu`zhhd.WW`RRRRRRRRR`@C58=B;`uzsfy{by`XNKl~v`zhhdg.WW`h{awcih`gzsvwfGcifuw`7@=7?`dxtX`f{yzh`yw`\xe6\x8c\x81\xe7\xbb\xad\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 ( \xe5\xb0\x8f\xe6\x97\xb6P\xe4\xb8\xad\xe9\x97\xb4\xe5\x81\x9c\xe6\xad\x87\xe4\xb8\x8d\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9fQ`{g:{b{hw`hc;AHGhf{by`E;6IJn`fwgdcbgwIF@`ywhFwgdcbgw<wsvwf`acigwacjw`fsv{c`stgc~ihw`ghsu}Hfsuw@{a{h`kw`ushuz`uf`vwx{bwDfcdwfh{wg`dc{bhwfHmdw`>GCB`$BK9)BnF}M|zaMnA(`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83\xe5\xb0\x8f\xe4\xba\x8e Z \xe5\xa4\xa9`xsXU`s<FhNK`\xe5\xa4\x9c\xe7\x8c\xab\xe5\xad\x90P\xe8\xb6\x85 )X% \xe7\x9a\x84\xe6\x97\xb6\xe9\x97\xb4\xe5\x9c\xa8\xe5\xb7\xa5\xe4\xbd\x9c\xe6\x97\xb6\xe9\x97\xb4\xe6\xb4\xbb\xe8\xb7\x83T \xe6\x88\x96\xe8\x80\x85\xe8\xb6\x85\xe8\xbf\x87 *X \xe5\x88\x86\xe9\x92\x9fQ`U`sbuzcf`Awv{sGhfwsaHfsu}`gufc~~`ucc}{w9bst~wv`65HH9FM`awv{s8wj{uwg` 112 `tmhw@wbyhz`=BDIH`bia=hwag`\xe5\x9c\xa8\xe5\x8d\x95\xe4\xb8\xaa\xe9\xa1\xb5\xe9\x9d\xa2\xe4\xb8\xad\xe6\xb5\x8f\xe8\xa7\x88\xe8\x80\x85`g{nw`F9G=N9`hwlhWwjwbhUghfwsa`shhsuz9jwbh`uzsbywvHciuzwg`k{hz7fwvwbh{s~g`~MLBjt`tm_dshz`-*Y+vtx,`u~{wbh@wxh`dxvX`IB@C58`u~{wbhHcd`8F5;`Hst~wh`}bBsY~`:F5;A9BH_G<589F`us~wbvsf` 1112 `t;:iN<>`h`~wjw~`hcIddwf7sgw`jv:a`{hwaG{nw`J=G=6=@=HM7<5B;9`cjwff{vwA{awHmdw`=bx{b{hm`11wbv11`bsj{ysh{cb`~cus~8wguf{dh{cb`ufwshwGzsvwf`asl`dck`fkuX`dxwX`ufwvwbh{s~g`xcuig`tm_~stw~`wbhf{wg`\xe6\x8c\x81\xe7\xbb\xad\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 YZ \xe5\xb0\x8f\xe6\x97\xb6P\xe4\xb8\xad\xe9\x97\xb4\xe5\x81\x9c\xe6\xad\x87\xe4\xb8\x8d\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9fQ`fwuw{jwf `Dfca{gw`ws`wlwuGuf{dh`Itibhi`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 ZZU[X \xe5\xa4\xa9`fksX`vwucvwIF=7cadcbwbh`:nvL>~`twhs`Aihsh{cbCtgwfjwf`mwsf`ct|wuhGhcfwBsawg`tK~gt;`\xe6\x8c\x81\xe7\xbb\xad\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Z \xe5\xb0\x8f\xe6\x97\xb6P\xe4\xb8\xad\xe9\x97\xb4\xe5\x81\x9c\xe6\xad\x87\xe4\xb8\x8d\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9fQ`asd`Oct|wuh Fweiwgh]`ucad{~wGzsvwf`tY5wY:(s`{uxu`shhsuzGzsvwf`uzsbyw`ysaas`D`v`j{gis~J{wkdcfh`ib~csv`ucbhs{bg`fib`\n    `@C58`tcvmIgwv`ct|wuhGhcfw`ufwshw`gw~wuh`stg`OXU-sUx5U:]`dc{bhwfvckb`\xe5\x9c\xa8\xe5\xa4\x9a\xe4\xb8\xaa\xe6\xa0\x87\xe7\xad\xbe\xe9\xa1\xb5\xe4\xb8\xad\xe6\xb5\x8f\xe8\xa7\x88\xe8\x80\x85`vwhsuz9jwbh`<5G<7<5B;9`_$fu`ucbbwuhGhsfh`Gsxsf{`gwf{s~{nwHcGhf{by`[|w5@wGgs*`NZJiNL>zv;J}`t`Ghf{by`gfu9~wawbh`bi~~`J9FH9L_G<589F`wbiawfshw8wj{uwg`CD9B`j{vwc`wffcf`biatwf{byGmghwa`s~dzs`sucg`$_MKHI`wjs~ishw`Cjwff{vwA{awHmdw`hsfywhHciuzwg`f{`gufwwbL`cxxgwh@wxh`uzwu}tcl`x{~wg`uaJlvK`$ta:XsLN~Fa~JmI<>`dc{bhwf=v`acbhz`gufwwbM`@{bil`ywhGcifuwg`shhf{tihwBsaw`xibu`F9GCIF79`tshhwfm`Oct|wuh 5ffsm]`G7FC@@`GH5FH`ucbhwbh`A9BI`fktX`~cus~w`_a{b7cibh`KCF?=B;_<CIFG`2`gefh`u~{wbhM`sjs{~Hcd`:{fwxcl`sjs{~@wxh`\xe6\x8c\x81\xe7\xbb\xad\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 , \xe5\xb0\x8f\xe6\x97\xb6P\xe4\xb8\xad\xe9\x97\xb4\xe5\x81\x9c\xe6\xad\x87\xe4\xb8\x8d\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9fQ`gcfh`ghshw`\xe5\x9c\xa8\xe5\x8d\x95\xe4\xb8\xaa\xe6\xa0\x87\xe7\xad\xbe\xe9\xa1\xb5\xe4\xb8\xad\xe6\xb5\x8f\xe8\xa7\x88\xe8\x80\x85`fwg{nw`vsm`$t_d~shxcfa`cxxgwhHcd`wbhfmHmdw`8CADsfgwf`gufc~~L`gufc~~M`hfsbgsuh{cb`\xe6\x9c\xaa\xe7\x9f\xa5`fwy`ibwgusdw`J)tK~b`jwfhwlDcg5hhf{t`uz{~v@{gh`cihwf<HA@`vw~hsL`siv{c`XXXX`7`{Dsv`azztav`/ wld{fwg1`5|sl fwgdcbgw tcvm vwufmdh{cb xs{~wv U `K<99@`cxxgwhIb{xcfa`cb@{bw`9bhwf`ucbbwuh9bv`\xe6\x8c\x81\xe7\xbb\xad\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\xb0\x8f\xe6\x97\xb6P\xe4\xb8\xad\xe9\x97\xb4\xe5\x81\x9c\xe6\xad\x87\xe4\xb8\x8d\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9fQ`5FF5M_6I::9F`;wh5~~Fwgdcbgw<wsvwfg`{bu~ivwg`wbvgK{hz`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 [U+ \xe5\xa4\xa9`dcg{h{cb`xfsuh{cbs~Gwucbv8{y{hg`svvwvBcvwg`tihhcbg`dxuX`gwh:~cshY*`bwlh`ghcfsyw`shhf{tihwg`:ibuh{cb`a{b`ywh:~cshY*`ID85H9`o`{Dzcbw`Biatwf`zs`7@=D6C5F8`b{syjcsfh`hciuzusbuw~`fwgdcbgw6cvm`fcch`5tcfh`:I@@_7@=7?_G9EI9B79`~sgh=bvwl`ucadcg{h{cbidvshw`}`af{xbc7v~c`/ GsawG{hw1Bcbw`*((+*u*x*Z*Y*u(x*Z*s*)*[+(ZXZY[vZXZZ+)*w*(*)***-*w*)*(ZZZXZ*Z*ZX)x+[*((+*u*x*Z*Y*u(x*Z*s*)*[+(ZX[v[vZX++*-*w*(*x++`svv6wzsj{cf`57H=J9`cf p`~cfhbc7 Z; fwms~D~swFVlucaf`wxxwuh5~~ckwv`\xe5\xbd\x93\xe5\x89\x8d Gwgg{cb \xe6\x98\xaf\xe6\x96\xb0\xe7\x9a\x84`fsyPt`{$_DD;;`\xe9\x94\xae\xe7\x9b\x98\xe4\xba\x8b\xe4\xbb\xb6`7zfcaw`~wjw~uzsbyw`x=w~vbsz`ib{xcfaZx`BC_6FCKG9F_I=_:F5A9`DC=BH9F_ID_CF_9BH9F_?9M`7@=D6C5F8_D5GH9`J`b`ggs~7idu`ywh9bhf{wg`\xe6\x9c\x89 Dc{bhwf Id \xe6\x88\x96 9bhwf \xe6\x8c\x89\xe9\x94\xae\xe4\xba\x8b\xe4\xbb\xb6`\xe5\x87\x8c\xe6\x99\xa8`uac`h~s Q~mnmxlntrSOFOFE`bzxjwsfrj`wybszumh{~{t{g{jh{}twk`7c`suhdzuFsxwwfzguT`B9HKCF?_7<5B;9`k{asl`sttfTsfwsTtsgwTtcvmTu{hwTucvwTxcbhTxcfaTzwsvTzha~T~{b}Tas{bTasf}TawbiTawhsTfitmTgsadTgdsbTh{awTsg{vwTsiv{cTwatwvTxfsawT{bdihT~stw~TawhwfTdsfsaTgas~~Tghm~wThst~wThtcvmThxcchThzwsvTh{h~wThfsu}Tj{vwcTsdd~whTtihhcbTusbjsgTuwbhwfTv{s~cyTx{yifwTxcchwfTzwsvwfT{xfsawT}wmywbT~wywbvTct|wuhTcdh{cbTcihdihTguf{dhTgw~wuhTgcifuwTghf{}wTghfcbyTsufcbmaTsvvfwggTsfh{u~wTusdh{cbTucaasbvTvwhs{~gT{g{bvwlTgwuh{cbTgiaasfmTtsgwxcbhTuc~yfcidTvshs~{ghTx{w~vgwhTxfsawgwhTawbi{hwaTbcxfsawgTbcguf{dhTcdhyfcidTdfcyfwggThwlhsfwsTt~cu}eichwTx{yusdh{cb`\xe6\x88\x90\xe7\x86\x9f\xe7\x94\xa8\xe6\x88\xb7. +U[X \xe5\xa4\xa9`vswz fsj`wsfm7VLC`s1usbv{vshw.`UUUUU k{bvck_fwuh_Z UUUUU`D@IG_Y)_A=BIH9G`bs{|`shwA`t{bv6ixxwf`dcdghshw`~su`wy6hhswhmf`5ffsm6ixxwf`a<c{nwvbv`+Z*)+(+)+Z*wZX*w+)*u*u`\xe5\x8d\xb8\xe8\xbd\xbd\xe4\xba\x8b\xe4\xbb\xb6`xcfuw`+[*Y**`h{cb.stgc~ih`T vwufmdhwv GB. `\xe4\xbe\xa7\xe8\xbe\xb9\xe6\xa0\x8f\xe5\xa4\xa7\xe5\xb0\x8f\xe5\xa4\xa7\xe4\xba\x8e\xe5\x86\x85\xe5\xae\xbdP\xe5\xbc\x80\xe5\x8f\x91\xe8\x80\x85\xe5\xb7\xa5\xe5\x85\xb7\xe6\x89\x93\xe5\xbc\x80\xe7\x9a\x84\xe5\xbe\x88\xe5\xa4\xa7Q`Acigw`pkzok`fw`suuw~wfsh{cb=bu~iv{by;fsj{hm`hf{byGit`__#u~sggHmdw`\xe5\xb7\xa5\xe4\xbd\x9c\xe6\x97\xb6\xe9\x97\xb4. \xe4\xb8\x8a\xe5\x8d\x88 -UYZ \xe7\x82\xb9\xe5\x92\x8c\xe4\xb8\x8b\xe5\x8d\x88 Y(UY, \xe7\x82\xb9`CB9_H56_J=9K9F`\xe6\x9c\x89 Hst \xe5\x92\x8c 9bhwf \xe6\x8c\x89\xe9\x94\xae\xe5\xba\x8f\xe5\x88\x97`PsbmUzcjwf`wubsfswdd`dsfwbh9~wawbh`~cyZ`~sfyw`:C7IG_6@IF`*,+`v{gdshuz9jwbh`^O\\lXXU\\l+:]R$`7@=D6C5F8_7CDM`vwtiyywf/_$vtP\"`ib{xcfaCxxgwh`+Z*)+[*x+)+Z*[*)`Qh{tUZ[P ~cfhbc7 Lwj{hu5 QahPfwms~D~swFVfwms~D~swF`fwhifb sOt]P`bh[`vc~{dbzcT~v{dbzx{cbcT~v{dbzhasw`Kwt5ggwat~m`\xe6\x8c\x89\xe9\x94\xae\xe9\x97\xb4\xe9\x9a\x94\xe5\xa4\xaa\xe7\x9f\xad`\xe5\x9c\xa8\xe7\xac\xac\xe4\xba\x8c\xe5\x9d\x97\xe5\xb1\x8f\xe5\xb9\x95\xe4\xb8\xad`gz{xh?wm`D@IG_YZ_<CIFG`YXVX`hcf`uszsfhufw`whzwfbwh`Agla~VLA@<HHD`fstgi`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89 Dc{bhwf Id \xe6\x88\x96 9bhwf \xe6\x8c\x89\xe9\x94\xae\xe4\xba\x8b\xe4\xbb\xb6`xtr{Bvzdyncr<|dbrd}`zswwvgfhG{fyb`shcfTvcuiawbh`J9H9F5B`ajg`__`uwGwfjwfg\" .`fs`h{~hM`wbst~w_`_{`A=8B=;<H`G9GG=CB_7CAA_7@CG98`fy`@BZ`_uifjshifw_gdwwv`l0~fdmjTgd~io`h{~hL`bcUfugc`jwfhwl5hhf{tDc{bhwf`Zhbwj9mw?wf{x`Gcz}uskwj~:gsVzzGuck}js:ws~zg`dg|Vb{yc~WbuVjcyVh{{aVfwhbwuiWW.gdhhz`{ai~`4vwtiyywf`hzdh`kb wvcK~Gwctwuh}fP~i`w~{tca`G9B8`kwb_gvccy`D@IG_,_<CIFG`c_7b`:~sgz`wfw~`9J9B=B;`$t_cbBsh{jwFwgdcbgw`O/&]`yv9 `Taf{xbcu Thfw~s'`~x~{lHhw`Agla~ZVLA@<HHDV)VX`.YVXVXV+ZYWW.dhhz`vD`efu}~a8c9lhzK>{<5dYgJM?I[F:AEk,=;xDC-Ztj@B|U+nL6sGbiXH7*ym_(Nw)voqpr !#$%PQRSTV/134O]^`\xe6\x99\x9a\xe4\xb8\x8a. Y,UZZ \xe7\x82\xb9`K{bvckg BH`twxcfw{bdih`s}shc~GbbwAvgwsgwy`7@CG98`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 ) \xe5\x88\x86\xe9\x92\x9f`+Z*)*(`fudmch`t{w~`*x*u*((Y*u*)+Z+(`ld--`u~{wbh shhsu} vwhwuhwv`\xe6\xbb\x9a\xe8\xbd\xae\xe4\xba\x8b\xe4\xbb\xb6`bwa`h{bm`bcvwHmdw`\xe7\xbd\x91\xe7\xbb\x9c\xe4\xba\x8b\xe4\xbb\xb6`8F5;_CJ9F`WvPS\\XQUO]-SVs xG{s\\fvWS\\`vai5d~~`vshs.`vchBHcuf}s`T if~. `W{hgycbbsxs{~`{dw~`DC=BH9F_ACJ9`\xe7\xa6\xbb\xe5\xbc\x80`]nUsO$\\^`wi~sJmhfwdcf`vg`uw{~`~csvwv`yCwkhfbcDfdhwmmaG~tgc`@5GH_Z_<CIFG`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89\xe5\xae\x8c\xe6\x95\xb4\xe7\x82\xb9\xe5\x87\xbb\xe5\xba\x8f\xe5\x88\x97`x{~wbsaw`vW` zcgh `\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 ) \xe5\x88\x86\xe9\x92\x9f`vg{~dms`jwfg{cb`acigw~wsjw`fytsPZ(XTYYXT)[TXV(Q`zsgzuzsbyw`6IHHCB`ivsf`dcgh`\"O9]\"`ywhIb{xcfa@cush{cb`56789:;<=>?@ABCDEFGHIJKLMNstuvwxyz{|}~abcdefghijklmnXYZ[()*+,-`vfsywbhwf`wkgtchwf`B5J_657?_:CFK5F8`gwwb~a{Uisw~jhiws`vfsycjwf`BsB`1hfiw`Hf{vwbh`{h`tcibvsfm1`B5J_CH<9F_<=GHCFM`vsf=ksawy`bnskt_sj|`D@IG_)_A=BIH9G`6fcsvusgh7zsbbw~`acigw`<w`[Y[Z[[[([)[*`DC=BH9F_75B79@`bcg|W`<@H7Ajssb~gw9bahw`dcg{`D:8DVxvh7~f`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Z \xe5\xb0\x8f\xe6\x97\xb6`lh`wfgG`B5J=;5H=CB`ktw{}Dhfw{ghgbwGhchsfwy`)V`sby~w`}{q`lwwd{fwahb~s`ucbhwlhawbi`$_ucbx{y__Vvwhs{~__ S1 Y`2huw|tcW02\"ldX\"1hzy{wz \"ldX\"1zhv{k \"tXwuvtXXssXXUZ,ttUxuYYU)t,-U-Y,xX)X[.v{g~u\"1v{ggs~u \"|}Z,tt\"1v{ huw|tc0`gsjw`$zcc`lmhvss`__y7fKwt`@9;9B8`fD~stc~y`ucadcg{h{cbwbv`tifs`}bs~t.hicts`gwh@cus~8wguf{dh{cb`G9GG=CB_7CAA_7F95H98`gwysiybs~`gdicdwfvh~JisCwxg`*+*)*w()+**)*w+([)`F979BH_G=AD@9_7@=7?_G9EI9B79`{g`G9GG=CB_7CAA_=BDIH_57H=J=HM`ywhn6{wDwcfh{gb`w~mhGvwhidac7hwy`\xe6\x97\xa9\xe4\xb8\x8a. +U- \xe7\x82\xb9`\nxibuh{cb 5uh{jwLCt|wuhPQ o\n    Obsh{jw ucvw]\nq\n`__sbuzcf__`sfsa`hbwaw~9m6wjcAwgicAwhs~ia{Gbwy`ACIG9_8CKB`d`{b{h{shcfHmdw`c`ag7fmdhc`h}ssb~FcGiubdfh{` gfx~l `PsbmUdc{bhwf. ucsfgwQ`85MG_ZZ_[X`vfsywbv`gwhI{bhY*`ahw{bNwc`yy{caq{dq~`cigwvckb`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 +UY( \xe5\xa4\xa9`hlw5hd~sz`@9GG_Y_A=BIH9`HF=5B;@9_GHF=D`bg`vckO`ol{)xb{yl/,Z`p 'c;yc ~=wVb'u`shhfJwfhwl`?wmtcsfv`8wg}hcd`8F5;_@95J9`s~d{dhu{sWclbzUcgkus}Ujxwg~zs`~vtl`xtr{Bvzdyncr<|dbr<|er`=yaws`N,L<|`wtb~sDw~v{iby`dsywLCxxgwh`Agla~ZVGwfjwfLA@<HHD`K{bvckg BH P\\vS\\V\\vSQ`vw~whw`:@C5H`kUUgsvshdUwf{jkwwUw~wahb`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 ( \xe5\xb0\x8f\xe6\x97\xb6`B9K_G9GG=CB`jwf`vv{@}biP~f`K{bvckg`:{fwxcl\\WP\\vS\\V\\vSQ`yP{zyqaamsq`8hsc`{g9lhwbvwv`Gufh{gd`|tguzwaw.WWeiwiw_zsg_awggsyw`rYtk|`b9`/hbshfcda{! *(*[,(+(YZ .lwvb{Un /hbshfcda{! %XXY .zhv{k /hbshfcda{! w~t{g{j .mh{~{t{g{j /hbshfcda{!`s~yb`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe5\xb0\x8f\xe4\xba\x8e Y \xe5\x88\x86\xe9\x92\x9f`awv{ia`Ct|wuh dfchchmdw asm cb~m tw sb Ct|wuh cf bi~~`dsfgwfwffcf`7dfhmwcm?{Dfs`fcK`_k_twfvj{fwg_fud{_hbx`W|gZu`\xe5\xbe\xae\xe7\xaa\x97\xe5\x8f\xa3\xe5\xa4\xa7\xe5\xb0\x8fP01 ZXXlZXXQ`H=BM_G=N9`Cxxugwfbws7jbgs`wusfH}ushGwfi`fdcha`KwtT`?9M6C5F8_8CKB`hyDw`gj{{`AJ`5uf8c:D8V:D`h9f`__dfchc__`\xe9\x9a\x90\xe8\x97\x8f`\xe6\x96\xb0\xe7\x94\xa8\xe6\x88\xb7. 0 Y \xe5\xa4\xa9`ywh5~~Fwgdcbgw<wsvwfg`__c5Nd)Gtm-aN__`:cfk`)Z*)*w*(*)+Z)X+Z*x*[*)+[+[(-*(`*)*Y+Z*[*,)X+Z*x+**-*(*)+Z`Ac`}~skl`\xe6\x9c\x89\xe9\x94\xae\xe7\x9b\x98\xe4\xba\x8b\xe4\xbb\xb6`\xe6\xb2\xa1\xe6\x9c\x89\xe6\xb5\x8f\xe8\xa7\x88\xe5\x99\xa8\xe5\x9c\xb0\xe5\x9d\x80\xe6\xa0\x8f\xe7\xad\x89\xe8\xbe\xb9\xe6\xa1\x86P\xe4\xb8\x80\xe8\x88\xac\xe5\x87\xba\xe7\x8e\xb0\xe5\x9c\xa8\xe6\x97\xa0\xe5\xa4\xb4\xe6\xb5\x8f\xe8\xa7\x88\xe5\x99\xa8\xe4\xb8\xadQ`_suuw~wfsh{cb`+[+Z*[*(*x*[`wldwf{awbhs~Ukwty~`09A698 {v1`Qmfhg{ywf fchuifhgbcu ]g|Z~v{twkOP~ctamG`zsbv~wf`gwdmHwa{a`A{ufcgcxh =bhwfbwh 9ld~cfwf`as;`\xe7\x94\xb5\xe6\xb1\xa0\xe4\xba\x8b\xe4\xbb\xb6`j__mi|vtofdeq__}fkafkd__?__mi|vtofdeq_}rfiqfkp__`<=;<_=BH`1k{b`vwj{uwcf{wbhsh{cb`dmkwtj{wkfwsvm`k1kckq`fcf`8wj{uwCf{wbhsh{cb9jwbh`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 , \xe5\xb0\x8f\xe6\x97\xb6`ACIG9`DC=BH9F_ACJ9_9J9BHG`sfv hzw us~~`lc{8wfhuc{TbcA6nlcfCw{hbATncc6DlusT}cA:nc~hsv9wyATncfCw{hbATncwHhl{Gwnv5i|hgATncgIfwc:iuTgcAInwg=fdbhiATncgIfwcA{vmxATnc{Kvbkcf8ys{yybATncc:uf6wcfw}=bsawyu=bcATncc6Clvfb{~sf;icTdcA6nlc~:lwATncc6vffwhGfs7h~cfcATncc6vffwhGfsGhmhw~ATncc6vffwhGfsKhv{zhATncc6vffwb97v~cfcATncc6vffwb9Gvmhw~ATncc6vffwb9Kvv{zhATncfHbsxgfcTacADnfwdguw{hwjATncwDgfwdhuj{Cw{f{yTbcA6nusx}usJwg{t{~{h{TmcAHnsfgbcxafhG~mTwcAHnsfgbcxaffCy{b{ATncd5wdfsbswuATncc:hbw:hsfiGwhw{hybTgcA:nbc@hbsiyysCwwjffv{TwcA<ndmwzgbATncsHGtn{TwcAAnfs{yGbshhfATncsAyfb{b9TvcADnvs{vybhGfsThcADnvs{vybb9TvcA6nlc{G{nybATncgIfwwGw~huATncfHbs{g{hbci8sf{hbcATncfHbs{g{hbc{H{aybi:ub{hbcATncfHbs{g{hbcfDdcfwmhATncfHbs{g{hbcw8s~TmcA5n{bsa{hbcsBwaATncb5a{hsc{8bfihsc{TbcA5n{bsa{hbc{H{aybi:ub{hbcATncb5a{hsc{=bwhsf{hbcc7biThcA5n{bsa{hbc{8wfhuc{TbcA5n{bsa{hbc~DmshGhsTwcA5n{bsa{hbc{:~~cAwvATncb5a{hsc{8b~wmsATncc6vffwhGfsThcA6nfcwv9fvbATncc6vffwa=ysTwcAHnsfgbh{c{TbcA5n{bsa{hbc`=A9_7CADCG=H=CB_ID85H9`95F@M_ACFB=B;`Z[(`cagi`ibgz{xh`Dc{bhwf Id \xe4\xba\x8b\xe4\xbb\xb6\xe6\x9c\x89\xe5\xbe\x88\xe5\xb0\x91 Dc{bhwf Acjw \xe4\xba\x8b\xe4\xbb\xb6`u~{wbhK{vhz`gh`uzsfgwh`)x*Y`?9M6C5F8_9J9BHG`ywhGiddcfhwv9lhwbg{cbg`s9gjwhwgb`fgcu`wbucvw`Pdc{bhwf. x{bwQ`bc{hdwul9sjs>`_x~{dFsh{c`A6Gc~6t{iv~fw`XVXVXVX`tgwfjwf`=B_G97CB8_G7F99B`}b{@vvs`autzk~z`__dk`k{bvck`jwfhwlDcg5ffsm`B9HKCF?_CB@=B9`eiw:g{hG~mwwgah`vsbfycw~img`v{gucbbwuh`wbst~wJwfhwl5hhf{t5ffsm`B9HKCF?_C::@=B9`v{guzsfy{byh{awuzsbyw`HCI7<_75B79@`Ei{Hu{}VaEwui}{aHw{`ywhFsbvcaJs~iwg`=BJ5@=8_K=B8CK_DCG=H=CB`9wjhb`gfytpd[pfwuZXZXpsbm`ucc}{w v{gst~wv`bfvs`Fwgdcbgw`un=`b=~h`_uifjshifw`wc`}+}lqw>ziks6q{|Jlmni}t|=|i|}{J9jrmk|L{m|:zw|w|cxm9nJ|iwjzwa{mz_/~mv|Jamjsq|<my}m{|0qtm=c{|muJwvwxmzilm|ikpml~qmakpivomJ:i|pP.Lxzw|w|cxmLill:i|pJ=w}zkm,}nnmzLxzw|w|cxmLkpivom>cxmJami|pmz,zqlomJkpzwumLk{qJxi{{awzl_uiviomz_mvijtmlJlwk}umv|LjwlcLbKu{Kikkmtmzi|wzsmcJmb|mzvitL+ll0i~wzq|mJ=wow}6woqv?|qt{J=w}zkm,}nnmzJ{pwa7wlit.qitwoJlwk}umv|L{mtmk|qwvL|cxm.m|iqtJ=@1:i||mzv/tmumv|L=@1_?83>_>C:/_9,4/->,9?8.381,9BJlwk}umv|Lwv{mtmk|qwvkpivomJlwk}umv|LjwlcL{|ctmLjiksozw}vl,tmvl7wlmJlwk}umv|Llwk}umv|/tmumv|Lwvzm{qdmJ-iv~i{<mvlmzqvo-wv|mb|P.Lxzw|w|cxmLamjsq|1m|3uiom.i|i2.J?-Amj/b|J-.+>+=mk|qwvLxzw|w|cxmLzmuw~mJ,twj.wavtwil-ittjiksJ_AB4=Jlwk}umv|Lu{-ix{6wksAizvqvo9nnJ-==-piz{m|<}tmJlwk}umv|L{kzwttqvo/tmumv|L{|ctmLnwv|@izqiv|8}umzqkJ0}vk|qwvLxzw|w|cxmLjqvlJkpzwumLixxL3v{|itt=|i|mJq{8wlmApq|m{xikmJ9jrmk|L{mitJlwk}umv|Llmni}t|-piz{m|J__nqzmnwb__Jwvum{{iomJ__{wow}_{mk}zm_qvx}|J-tw{m/~mv|Lxzw|w|cxmLqvq|-tw{m/~mv|Jom|7i|kpml-==<}tm{J8w|qnqki|qwvJ2>760zium=m|/tmumv|Lxzw|w|cxmLpi{:wqv|mz-ix|}zmJlwk}umv|LjwlcLwvuw}{mmv|mzJ9nn{kzmmv-iv~i{<mvlmzqvo-wv|mb|P.JkpzwumJ9jrmk|Lxzw|w|cxmL__lmnqvm=m||mz__Jlwk}umv|Lnqtm-zmi|ml.i|mJamjsq|+}lqw-wv|mb|Lxzw|w|cxmLktw{mJ1m|:mzn>m{|{J7mlqi-wv|zwttmzJmb|mzvitL3{=mizkp:zw~qlmz3v{|ittmlJ>mb|>ziks6q{|Lxzw|w|cxmLom|>ziks,c3lJlwk}umv|L{mtmk|qwvJlwk}umv|LjwlcL{|ctmLtqvm,zmisJlwk}umv|LjwlcL{|ctmL|mb|+tqov6i{|J=kzmmv9zqmv|i|qwvJlwk}umv|LjwlcL{|ctmLuqvAql|pJ=xmmkp=cv|pm{q{?||mzivkmJwvmzzwzJAmj5q|0tio{J<milmz7wlm+z|qktm:iomJ__wxmziJ:mznwzuivkm:iqv|>quqvoJxmznwzuivkmJlwk}umv|LjwlcL{|ctmLu{>mb|=qdm+lr}{|Jlwk}umv|LjwlcLwvxiomJ=@11zixpqk{/tmumv|Lxzw|w|cxmLuwd<my}m{|:wqv|mz6wksJ-tqks.i|iJ7mlqi/vkzcx|ml/~mv|J__$_yqpwwQTN_$__Jlwk}umv|Lwvuw}{muw~mJ,mnwzm3v{|itt:zwux|/~mv|Lxzw|w|cxmL5/C?:J2>760zium=m|/tmumv|Lxzw|w|cxmLamjsq|<my}m{|0}tt=kzmmvJmb|mzvit`YZZY`x{~wBsaw`wb`w_wjhbs<vbw~gf`**+)*w*[+(*-*x*wZXZ,Z-ZX+tZX)t*w*Y+(*-+**)ZX*[*x*(*))vZX+v` chh wzv xwb{vwd cfmlz bs~vfw`8F5;_9BH9F`8CB9`\xe4\xb8\xad\xe5\x8d\x88. YZUY( \xe7\x82\xb9`dsywMCxxgwh`Z`'$_hg']/`:~csh[Z5ffsm`vfcd`\xe5\x93\x88\xe5\xb8\x8c\xe5\x8f\x98\xe5\x8c\x96\xe4\xba\x8b\xe4\xbb\xb6`#Y+w`Dcfml`bhfc`DC=BH9F_ID_K=H<CIH_DC=BH9F_ACJ9G`8shw`*+*)*w()+**)*w+(`ACIG9_CJ9F`bwkIF@`8shs`ACIG9_ID`B=;<H`_tgvfwus`W.igwf_xcbhg`sj{y`\xe5\xa4\x9c\xe6\x99\x9a. ZZUZ( \xe7\x82\xb9`Qmw} Twi~sjPPzus9fcxVgfwvswzVwgbcdgwf`wf`(v*x+s(Z*x+,(Y*u*-*+*wZu(v*x+s(Z`^\\gRsh\\gSPVR3QP31\\gRO\\Pp\\O]p$Q`wd`++*)*Z*+*u`5ffsm`:f{xwlcPWv\\QS`g__362__*`w_kb`Hwlh8wucvwf`shhf{tihw jwuZ shhfJwfhwl/jsfm{by jwuZ jsfm{bHwl7ccfv{bshw/ib{xcfa jwuZ ib{xcfaCxxgwh/jc{v as{bPQojsfm{bHwl7ccfv{bshw1shhfJwfhwlSib{xcfaCxxgwh/y~_Dcg{h{cb1jwu(PshhfJwfhwlTXTYQ/q`pTzk[zok+zhVQ`A5HIF9`=A9_7CADCG=H=CB_9B8`su~~zDbschTad_szhbac`k{bvckVj{gis~J{wkdcfhV`k5a|6+*kc+oc_3,[/3W_`OBc giddcfh]`b9{hmh`\xe9\x87\x8d\xe7\xbd\xae\xe4\xba\x8b\xe4\xbb\xb6`fwv{fwuhwv`^P3.\\voYT[qP3.\\Vp$QQo(q`vw~{jwfmHmdw`cb~{bw`_f`viwyt`U2gwhhwf.`DC=BH9F_CIH`tixxwf`Obc asd]`fufyuYbtfmjof`fhwfi bmhwdxc_ ~ytc~stCw|hu!  1i\"vbxwb{vw \"&&h dmcw x{kvbkc!  1i\"vbxwb{vw \"&&_ ~ytc~stCw|hu1  1{kvbkc`(**Y+**)(-*[*x*w(s*Y+**Y(-*w+(*)+Z***Y*[*)Zu*s*)+[*-*x*w`dfc`Dhwy`gw~{wibvaS\\`^Ons]Uqo_[UOns-X]UZoqZs_UOSn$]`cbhciuzghsfh`{~hg`85MG_,_Y(`xvswhi_~{_ahiwhc`56789:;<=>?@ABCDEFGHIJKLMNstuvwxyz{|}~abcdefghijklmnXYZ[()*+,-SW1`*[*u*-*)*w+((-*w***x+Z*v*Y+(*-*x*w`PQ o`@CK_=BH`c6t~`l9cstw{@mx{hcBTcstw{@mx{hcBT:8D?gb{bIcstw{@Tggwfvv5hgc<hwGcs6w{@ThgwiewFvbwGcs6w{@Tbc{huw~wGfwtawawFcstw{@TfuCwysa=bwdCcstw{@Tggwfvv5gb8di}cc@cs6w{@Thgb=cstw{@Tbc{gfwJhw;cstw{@T8=IIhw;cstw{@Tcxb=fwgIhw;cstw{@TgxwfDhw;cstw{@T~fIvsc~bkc8cstw{@Tubmg5hgwiewF~~s7cstw{@ThgwiewF~~s7cstw{@TwhshG_di}us6cstw{@TmfwjcuwF_di}us6cstw{@Tvsc@_di}us6cstw{@Tbc{gfwJhw;_di}us6cstw{@Tdi}us6_di}us6cstw{@Tcxb=hbicuu5wasy_~~{:chi5cstw{@T~fIzuhsAv5cstw{@`fchsh{cb5by~w`GH5H=7_8F5K`_qZZo]-UXnUsO_q[o`fct5`IABG59?_89J8BFCK_69@;`{x~~`*v*)*Y+[+)+Z*))(*)+,+(`G9GG=CB_7CAA_H56_7F95H98`fsbywA{b`8wj{uwAch{cb9jwbh`sdhuzs_fwxfwgzTu`\xe6\x9c\x89\xe7\xae\x80\xe5\x8d\x95\xe7\x82\xb9\xe5\x87\xbb\xe5\xba\x8f\xe5\x88\x97`~{bwBiatwfTuc~iabBiatwfTx{~wBsawT~{bwTuc~iabTvwguf{dh{cb`dfwggifw`<=;<_:@C5H`hfcb`Cdwb`ywbw9bj_hZ(`r~x`8F5;_9B8`Y/`acnFH7Dwwf7cbbwuh{cb`8F5;_GH5FH`wszsq`zwu}@cy{bTvwufmdh7s~~tsu}`Y*X+*,(,`H9H9_JB`dcgwhgAygws`ucad~whw`vw~hsAcvw`xarc_`xuihbb{ cP$g$wwu~fhTcg hOhsBfwc]voQ  cOa7bavs{ b@5wD  =q]`Hwlh9bucvwf`fwhbw7wysggwAfwgkcf67ITu{ggs~7fwgkcf67IwfD$` zw{yzh1* k{vhz1Y hmdw1sdd~{ush{cbWlUgzcu}ksjwUx~sgz gfu1`vfsyghsfh`cc`*+*)+(()+,+(*)*w+[*-*x*w`xPbihuc{Pb Qjofs`$tx,-sXY*$`)x)x***-+Z*)***x+,)x)xZu)x***-+Z*)***x+,)x)Z*)*Y*(*)+Z(v*x*(*)`F979BH_DC=BH9F_ID_CF_9BH9F_?9M`8F5;_8FCD`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y) \xe5\x88\x86\xe9\x92\x9f`||}jwmjuxwn`~{hm`uhyrdqfu`cv`DC=BH9F_ID_K=H<_DC=BH9F_ACJ9G_HCC_:5F`un`Ct|wuhV=b|wuhwvGuf{dhVwjs~ishw`c~`bwkJs~iw`Agla~ZVLA@<HHDV(VX`ufwvwbh{s~~wgg`AG=9`sF~wvJw{FcwVJs{~cvPwQh ah5{uLj wb7hc~f cZPU[htQ{`ck`ixub{hbcQPfohwfi b{kvbkcyVhwc7dahivwhG~mPwzhg{VQwyDhcfwdhfJm~swi\"Pcdb{whUfjwbwghQ\"q/`ai{bw~wG~~suTai{bw~wg_Tfwvfcu`G=AD@9_7@=7?_G9EI9B79`\xe7\x82\xb9\xe5\x87\xbb\xe4\xba\x8b\xe4\xbb\xb6`wvcBfwgm~sb5`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89\xe7\xae\x80\xe5\x8d\x95\xe7\x82\xb9\xe5\x87\xbb\xe5\xba\x8f\xe5\x88\x97`\xe5\x8a\xa0\xe8\xbd\xbd\xe5\xae\x8c\xe6\x88\x90`G_~wbwi{_a8=_9wF`FH7Dwwf7cbbwuh{cb`un_g~h{`Hst \xe7\x9a\x84\xe6\xb4\xbb\xe8\xb7\x83\xe7\x8a\xb6\xe6\x80\x81P\xe6\xaf\x8f\xe7\xa7\x92\xe4\xb8\x80\xe6\xac\xa1\xe4\xba\x8b\xe4\xbb\xb6Q`=b{hGuf{dhgT`vwucvw`szvwgwGf{hbfSy1 w m}`\xe8\xb5\x84\xe6\xba\x90\xe4\xba\x8b\xe4\xbb\xb6`\xe6\xbb\x9a\xe5\x8a\xa8\xe4\xba\x8b\xe4\xbb\xb6`(((*)X*,*)*u+**)+(*-*[*Y[t)(*-*Z`{by7cbhwlhZ8`^PP3.O\\vsUx]oYT(qP3..pQQoXT,qQP..Q3PP3.O\\vsUx]oYT(qP3..pQQoXT,qQ$`tk}wF{wh`CD9B98`~xkcb_kw`ucadcg{h{cbghsfh`GD97=5@_G7F99B_G=N9`__kdf_uwfcwvDffwcxafu5{hbc_Td__kwfcuvffwwGGh~wuwchTf__kdf_xwwfzgjCfws~Tm__kdf_uwfcwvFfuwfc5vhuc{Tb__kdf_uwfcwvGfshwh`acigwwbhwf`CF=9BH5H=CB7<5B;9`Y,dl '5f{s~'`O\\\\\"\\iXXXXU\\iXXYx\\iXX+xU\\iXX-x\\iXXsv\\iX*XXU\\iX*X(\\iX+Xx\\iY+t(\\iY+t)\\iZXXuU\\iZXXx\\iZXZ,U\\iZXZx\\iZX*XU\\iZX*x\\ixwxx\\ixxxXU\\ixxxx]`w7Gxszdf`mffzylm`zD:=w`uiGhti`dc{bhwfacjw`__gu_`IBG9BH`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89\xe6\x8c\x87\xe9\x92\x88\xe7\xa7\xbb\xe5\x8a\xa8\xe4\xba\x8b\xe4\xbb\xb6`awhzcv`mct`ybwj9bw(h`yGw{b~asiAhcwwi7gu~}{`s~~`Agla~ZVGwfjwfLA@<HHDV)VX`$~gdT$$~gftT$$~cyywfT$$57LIH=@GT_57L_9J5@_D5GGT_57L_<CC?GT$fwsvm7cvw5~fwsvm9lwuihwv=bHz{g:fsaw`gas~~`ucfgg`*u*Y*w*++)*Y*+*)+[ZX+u+uZX)tZ+*)*wZv)))[Z+ZuZXZ+*)*wZ+)v`fwsvkf{hw`hg6w`hw`^PVR3QP314Q`vwtiyywf/WWgcifuw.`s7~~{Gwh`~sgh=bvwlCx`uz{~vfwb`hm`{jwf_wjs~ish`h9`us~gg`fdgsiwtz`|qy_rmnw}rorn{`FCC?=9`Puc~cfUysaih`sd`\xe6\x9c\x89\xe6\x8c\x87\xe9\x92\x88\xe7\xa7\xbb\xe5\x8a\xa8\xe4\xba\x8b\xe4\xbb\xb6`h `fd`k{x{`\xe5\xb7\xa5\xe4\xbd\x9c\xe6\x97\xb6\xe9\x97\xb4P-UYZ \xe7\x82\xb9T Y(UY, \xe7\x82\xb9Q`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 ,UY( \xe5\xa4\xa9`\xe7\xaa\x97\xe5\x8f\xa3\xe5\xae\xbd\xe9\xab\x98\xe6\xaf\x94\xe5\xbc\x82\xe5\xb8\xb8P\xe6\x9e\x81\xe7\xaa\x843Q`kwt}{h=bvwlwv86`h:`_fsh{c5uuw~wfsh{cb7zsbywv`tkvwjfw{`AI@H=_H56_J=9K9F`]20{20W{20!Owbv{x]UU2`ihxU,`|sjsguf{dh.`nkhhm<axf`\xe7\xaa\x97\xe5\x8f\xa3\xe4\xbd\x8d\xe7\xbd\xae\xe4\xb8\x8e\xe5\xb1\x8f\xe5\xb9\x95\xe7\x9a\x84\xe7\x9f\x9b\xe7\x9b\xbeP\xe7\xaa\x97\xe5\x8f\xa3\xe8\xa2\xab\xe6\x94\xbe\xe5\x9c\xa8\xe4\xba\x86\xe5\xb1\x8f\xe5\xb9\x95\xe7\x9a\x84\xe5\xa4\x96\xe9\x9d\xa23Q`asuCG`fb k{bvckVhc`vuwvcIw=F`goR\\b\\sO`DC=BH9F_CJ9F`ufwshwDfcyfsa`\xe4\xb8\xad\xe5\x8d\x88PYZUY( \xe7\x82\xb9Q`HD9CAFFM5`Agla~ZVLA@<HHDV*VX`Agla~[VLA@<HHD`bvcgw`dsyw@wxh`~5V7ybcfh~c`9f`dih`gufwwbV`FGJ`gsb_js`xG`+X+Z*x*v+X+(`s~h?wm`cgpiev:mqisyx`XYZ[()*+,-stuvwx`gsjbsu`if~P#vwxsi~h#igwfvshsQ`_awsb8{xxwfwbuw`jmi|qcloj`us~~tsu}`~gwwiba{`0!UUO{x yh =9 `u<~~b{hw`x~`cf{wbhsh{cbuzsbyw`suhd`7@CG=B;`5cthfc7hbcf~~fw`cdh{cbg`uw~~i~sf`AG{Dbcfh9wbjhw`P{cyfs{~b{Tb fhjwHsz~gfzwvcQ~`j~siw`*(*Y+(*YZv*t*Y*w+(+)`sdzh`\xe5\xbd\x93\xe5\x89\x8d gwgg{cb \xe6\x9c\x89\xe5\x85\xb6\xe4\xbb\x96\xe7\xbd\x91\xe7\xab\x99\xe7\x9a\x84\xe5\xaf\xbc\xe8\x88\xaa\xe5\x8e\x86\xe5\x8f\xb2`YZYhw}ucG~s`8shsJ{wk`g0sd bs~yb\"1zn \"hg~m1wx\"bcUhsx{am~a.~a{~/{cxhbgUn{.wYYd(\"la2aaaaaaaaaa~~{{0{gWsd2b`zap2e{}p~~tzy`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y) \xe5\x88\x86\xe9\x92\x9f`kwt}{hFH7Dwwf7cbbwuh{cb`ga{<vvbw`QSv\\PW\\lcxwf{:`=bhwfbwh 9ld~cfwf`ZZ`awhs?wm`\xe8\xb5\x84\xe6\xb7\xb1\xe7\x94\xa8\xe6\x88\xb7. [XU-X \xe5\xa4\xa9`igwDfcyfsa`(s)[(x(w`<=889B`wGcA:t~{:~fcHaccT~cGcyAiwg`pg;_xipgkf;iveyfd..VQ56H`efu}~a8c9lhzK>{<5dYgJM?I[F:AEk,=;xDC-Ztj@B|U+nL6sGbiXH7*ym_(Nw)vr!4$%^&RPQS102V3W./oqO]p `zt_c{lwbfhuxws`DC=BH9F_ID_5H_79BH9F98_DCG=H=CB`YZ+VXVXVY`_sjy7ifjshifw`\xe6\x9c\x89\xe5\xae\x8c\xe6\x95\xb4\xe7\x82\xb9\xe5\x87\xbb\xe5\xba\x8f\xe5\x88\x97`GF`vwj{uw=v`imqans`Gmhw~`j`8acghBHcuf}s`7sbj`EG9@uldw{hbcGT;J`+Z*)*w*(*)+Z)X+Z*x*[*)+[+[(-*(`_d_s~km{fzy_h~ytc~s~_g{whwbgfu_wz}u__`ufwshw9jwbh`Agla~ZVGwfjwfLA@<HHDV*VX`fwxwffwf`\xe5\x8a\xa0\xe8\xbd\xbd\xe4\xba\x8b\xe4\xbb\xb6`zha~`cxxgwhM`wyv{f6G>b{l{wK`{iUkcvszgUvswzfwa`F979BH_H56_9BH9F_?9M_G9EI9B79`t4uuF`97@H9BF_CC6KFFG_9BK8=_C7KG@9C`dc{bhwfid`wTet`:C7IG_CIH`\xe9\xbc\xa0\xe6\xa0\x87\xe4\xba\x8b\xe4\xbb\xb6`buwC`dim`ufwshwCxxwf`xbihuc{ bXsX_xlstPtX_)l[w(vT,X_Zlw*)[Q(jofs_ lX)[x(sxs1_XlX)[x(QPf/hwfi bXsX_xlst1tixub{hbc_PlXtxts*,_TlXXYY+x)oQX_xlst,t1*X_xlst,tU*lXwvj/fs_ lXt(,(ws_1lX)[x(sx_OlXtxts*,/]wfihbf_ lXt(,(wsq/sT_XlXtxts_PlXw)v[,(_TlX*Z[w()/Qjqfss _XlX-YZY(Xs1_XlXtxtsP/ixub{hbc_PlXvZ(*Y[_TlX)Y--ZtoQsj fX_ZlX(vs1XXsX_xlstTtX_sl[x,Z1YX_Zl*v[(PY/Qzk~{Pw!!]OoQfhomsj fX_Yl+)w-1xdUfswgb=PhX_ZlX(vsPXlX[wQQXWYldSfswgb=PhX_ZlX(vsPXlX(wQQXWZlPRsdgf=whb_PlX(ZsXXvXPxlQXWQlXQ[dSfswgb=PhX_ZlX(vsPXlX[xQQXW(lUSsdgf=whb_PlX(ZsXXvXPwlQ)WQlXS)sdgf=whb_PlX(ZsXXvXPwlQ,WQlXS*sdgf=whb_PlX(ZsXXvXPwlQxWQlXR+UPsdgf=whb_PlX(ZsXXvXPwlQ*WQlXQ,dSfswgb=PhX_ZlX(vsPXlXZxQQXW-lPRdUfswgb=PhX_ZlX(vsPXlX)xQQXWsl/Qx{_PlX)Y-+xw11_1lX)Y--ZttQwf}sw/g~ wX_sl[x,ZOYd'gi'zP]X_sl[x,ZOYg'{zhx]'QP/Quqhszu_PlXtZ-Z)(oQX_sl[x,ZOYd'gi'zP]X_sl[x,ZOYg'{zhx]'QP/QqqPqXsX_[l()TxlX-sXYQt/Qixub{hbcs _XlX)[x(QPjofs_ lXv,ZxX,O1y'hwl9whgbc{'b'TX(-*X*lE8xAIT'Y'Y*)Z,X:GH9mGT'['XZ[ZXZ9>cFe|T'Y'-*X(*-7c~x>zT'a'tc~{'w'T+ZZ-ZZ;*f;j>'k'Tgifwy5bw8hhs's'TBI5A?G89F_B9989F_F9K;6'@'Thg{fybx{'m'Ts8wh{Hwac:afhsT'h'a{Nwbc'w'Tgifwy5bw'h'T(YdF?b<GT'['DFgx}kT'I'ABG59?_89J8BFCK_69@;T'-'x>mmyFT'(')*Z,,ZnxG;zyT'~'bwhy'z'T+Z+Z[(EX<c>G'e'Twfcgj~vwdC{hbc'g'Twy7hbcwhhlT'y'hwsDsfwawh'f'Ts~ybsiwy'g/]XsX_[l()1xixub{hbcQPfohwfi bX_,lxv,Z/X/qwfihbfs _XlX)[x(QPq/sj fXsX_ZltZ*[1+'osi.'sb{jsychOfXsX_YlY-XZP(lXww]Q'Tuz.'sb{jsychOfz'fskvfs7wbciuffbwmu]''Txd.'sb{jsychOfd's~xhfc'aT]a'tc.'sb{jsychOfXsX_YlY-XZP(lX-w]Qb3jsy{hsfc'Ogifwy5bw8hhs'sO]XsX_YlY-XZP(lX+w]Q'.'3'Ty~'g>.CGOBXsX_YlY-XZP(lXtw]QbPjsy{hsfcsO_XlX-YZY(XXPwlQYQ]TqXsX_(l+w-s1)3'/'x{CPxxugwfbws7jbgsoQsj fXsX_)lYtvw1,wb kxCgxfuww7bbssjPglXTYlXQY{/PxXsX_)lYtvwO,XsX_YlY-XZP(lXxv]QoQsj fXsX_[l)[*[1)XsX_)lYtvwO,XsX_YlY-XZP(lXxv]Q'Pwkyt'~/Qx{sP_XlX[[[))*&&XsX_[l)[*[O)y'hwl9whgbc{'b&]s&_XlX[[[))*sO_XlX-YZY(XXPwlQXQ]jofss _XlXt,tZvXs1_XlX[[[))*sO_XlX-YZY(XXPwlQZP]K'69@;v_twyif_bwwvwf_fb{cxQ'{/PxXsX_,lZtXtQvXsX_(l+w-s1)XsX_[l)[*[O)XsX_YlY-XZP(lXXw]QsP_XlXt,tZvXsO_XlX-YZY(XXPxlQYQ]'S'TsS_XlX[[[))*sO_XlX-YZY(XXPwlQXP]XsX_,lZtXtOvXsX_YlY-XZP(lXsw]Q/Qqqjqfss _XlX-(t*ss'1'3{/Pxb=~h&&b=~hsO_XlX-YZY(XXPwlQuQ]jofss _XlX*Yx[X[=1hbO~XsX_YlY-XZP(lXuw]QQP{/PxXsX_Yl[*[x&Xs&_XlX*Yx[X[sO_XlX-YZY(XXPvlQwQ]jofss _XlXwYXv,(s1_XlX*Yx[X[sO_XlX-YZY(XXPvlQwP]/Qx{sP_XlXwYXv,(&&XsX_Ylvw(XO,h'a{Nwbc'wQ]XsX_(l*-st1sXsX_Ylvw(XO,XsX_YlY-XZP(lXvw]Qq/jqfss _XlX[ZwXYtO1XsX_ZltZ*[T+XsX_(l+w-sT)XsX_(l*-st]sx/fcjPfss _XlXYYtx,xX1Xls/_XlXYYtx,xs0_XlX[ZwXYtsO_XlX-YZY(XXPxlQ(/]XsX_YlxYxtS,QSwgx~'OcdhgwAggys'wP]sO_XlXYYtx,xsT_XlX[ZwXYtsO_XlXYYtx,x]]/Q`P^\\WRQpP\\WR$Q`wysggwabc`G9GG=CB_7CAA_H56_7@CG98`85MG_Y_Z`7cbhwbhUHmdw`85MG_[_+`+`gufwwbHcd`HCI7<_ACJ9`U2Oxibu].`cxx~{bw`ca{h`bx_hd{fug_fwj{fvtwk__Tubix_hd{fug_fwj{fvtwk__Tvwddsfkbi_fwj{fvlx__Tvwddsfkbi_ai{bw~wg__Tvwddsfkbi_fwj{fvtwk__Tvwddsfkbi_fwj{fv__Twhsi~sjw_fwj{fvlx__Twhsi~sjw_ai{bw~wg__Twhsi~sjw_fwj{fvtwk__Tw`__wkvt{fwj_fjw~ssiwh`!bwk xibuh{cbPQowjs~P\"hz{gVs1Y\"QqPQVs`D@IG_Z_<CIFG`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\xb0\x8f\xe6\x97\xb6`k{bvckV`vcbw`@5GH_,_<CIFG`bTkcvb{k`zhhdg.\\\\`tsgw`wfzwsvpvcuiawbhUif~Ufwgc~jwfTzsaawfzwsvpw~wawbhU~{ghwb{byUwjwbhgUghcfsywUdfcdTzsaawfzwsvp~cush{cbUkfsddwf`Agla~ZVLA@<HHD`[Y[YZw`?9M6C5F8_DF9GG`\xe6\x97\xa9\xe4\xb8\x8a`cdh{cb`y~cts~Ghcfsyw`gwhsb{vfcc7hbwj9}uc~6hwy`bc{huwhw8Vw`bcaa`dsfgw:fcaGhf{by`h{jw`\xe5\xa4\x9c\xe6\x99\x9aPZZUZ( \xe7\x82\xb9Q`xcbh:sa{~m`bc{gfw`h{cbPQofwhif`hshg`^\\gSp\\gS$`cxxgwhL`{t{g{jga`6cc~wsbTBiatwfTGhf{byTGmatc~TCt|wuhT:ibuh{cbT5ffsmTFwy9ldTFwx~wuhTK{bvckT8cuiawbhT9jwbhTLA@<hhdFweiwghTxwhuzTDfca{gwT9~wawbhT<HA@9~wawbhT<HA@=bdih9~wawbhT<HA@8{j9~wawbhT0sbcbmacig2T<HA@6ihhcbT<HA@8cuiawbhT<HA@@=9~wawbhTAihsh{cbCtgwfjwfT<HA@6ihhcb9~wawbhT<HA@8shs@{gh9~wawbhT<HA@8shs9~wawbhT<HA@8@{gh9~wawbhT<HA@C@{gh9~wawbhT<HA@7sbjsg9~wawbhT<HA@5buzcf9~wawbhT<HA@=asyw9~wawbhT<HA@@stw~9~wawbhT<HA@@{b}9~wawbhT<HA@Asd9~wawbhT<HA@Awbi9~wawbhT<HA@Cdh{cb9~wawbhT<HA@Dfw9~wawbhT<HA@D{uhifw9~wawbhT<HA@Gcifuw9~wawbhT<HA@Gdsb9~wawbhT<HA@Hst~w7w~~9~wawbhT<HA@H{h~w9~wawbhTk{bvckT<HA@:cfa9~wawbhT<HA@6cvm9~wawbhT<HA@5fws9~wawbhT<HA@J{vwc9~wawbhT<HA@8{s~cy9~wawbh`vfcd9xxwuh`{wk`ACIG9_ACJ9`\xe4\xbc\xa0\xe5\xa5\x87\xe7\x94\xa8\xe6\x88\xb7. 2 -X \xe5\xa4\xa9`fiwfhhbm cdxw_ ~_vcGs{udf1h1 x i\"hb{u\"c b &h&wmcd_x_ hvws~_cu u1}\"1x uihbb{\"c`\"O:]\"`cbidyfsvwbwwvwv`fx{`GwhFweiwgh<wsvwf`~cu{schsbft`}$T$zvl$T$gv`uzsfy{byuzsbyw`xaz|pgQArny?ynhra 6U 2|{ca|yQT`8{gdshuz9jwbh`sddsGbus5l|i7bcshdTudsG~b{7Tus}Gdud:scbguCiTishGdud?swbcmk8sbdTudsGwbm?TIsdGdudGswbFbwvsdu~wwbashdTudsGbbFCvwmssGhhzws7wbFy~wsdauwwTbshGdud@scb<ssv~bwvsfdTudsGsbyDcws@vvTwdsGdbuGsDwsh@ycwwsvvdTdssGbubKv{7cckhi7bbzysTw=vwbu|dhd5sGbufG{uTd{hwbu|vh5wGdudGsubdfh{`5y7c`Zv[-[-` ucvw\\]\\gRq`xcbh`G9GG=CB_7CAA_H56_5@=J9`69:CF9_=BDIH`\xe5\x87\x8c\xe6\x99\xa8. XU+ \xe7\x82\xb9`DC=BH9F_ID_K=H<_:9K_DC=BH9F_ACJ9G`xibuh{cb \\GS3\\P\\Qo\\GS`5bvfc{v P\\vS\\V\\vSQ`fgw~cwjCvhdc{gb`t{~{`Agla~ZVGwfjwfLA@<HHDV(VX`~{bwBiatwf`5|sl fwgdcbgw tcvm {g bch wbufmdhwvT fwgdcbgw ~wbyhz. `df`acn7cbbwuh{cb`vweead+TT`fhh`nzhgm|gm2bg{hp`dh`dm`@5GH_Y_<CIF`xcuigcih`\xe5\x8a\xa0\xe8\xbd\xbd\xe4\xb8\xad`\xe5\xbd\x93\xe5\x89\x8d\xe9\xa1\xb5\xe9\x9d\xa2\xe9\x80\x9a\xe8\xbf\x87 tsu}Wxcfksfv \xe6\xb5\x8f\xe8\xa7\x88\xe6\x9d\xa5\xe7\x9a\x84`bqthpx`x{bwpucsfgwpbcbwpsbm`,`*,*Y+Z*(++*Y+Z*)([*x*w*[+)+Z+Z*)*w*[+-`uhf~?wm`}wmdfwgg`\xe6\x8c\x87\xe9\x92\x88\xe4\xba\x8b\xe4\xbb\xb6`Hmdw9ffcf`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9f`gufc~~K{vhz`ag=bvwlwv86`fst~sbcgfwd`hmGhshw`sgFw`vfsy~wsjw`dJ`@C5898`dfwu{g{cb`twzsj{cf`fwhi`fDxwacsfwbCuwtfgfj9wfbmhg@h{`k{s_ha{_ycudaw~wh`7zfcaw\\WP\\vS\\V\\vSQ`-`$`tj`dsfgw9ffcf`DC=BH9F`wbucvwIF=7cadcbwbh`brf};tzhm7tnsyx`ywhI{bhY*`_gdwwvL[`  O\"ofi\"~. \" hgbig.ihXbVY{gddczwbuVacq\" T\"ofi\"~. \" hgbig.ihVb}wy{Vswb\"hTqo i\"~f \" .g\"ih.bhgbixVvkwbVhwb\"hTqo i\"~f \" .g\"ih.bhgbi{Vwvgsd{uVacq\" T\"ofi\"~. \" hgbig.ihVbd{whV~fc\"yTqo i\"~f \" .g\"ih.bhgbifVl{whw~cuVawgq\" T\"ofi\"~. \" hgbig.ihVbug~zbiVvwvq\" T\"ofi\"~. \" hgbig.ihVbV~cyycw~uVacY.[-ZXq\" T\"ofi\"~. \" hgbig.ihYb~VyVcc~yVwcu.a-YX[\"ZTqo i\"~f \" .g\"ih.bhgbiVZV~cyycw~uVacY.[-ZXq\" T\"ofi\"~. \" hgbig.ih[b~VyVcc~yVwcu.a-YX[\"ZTqo i\"~f \" .g\"ih.bhgbiV(V~cyycw~uVacY.[-ZXq\"]             q `huiv`A98=IA_:@C5H`vxe~c`t}`mACDBAGGBH`/ dshz1W`v{guzsfy{byH{aw`s~wfh`cb{uwusbv{vshw`stuvwxyz{|}~abcdefghijklmn56789:;<=>?@ABCDEFGHIJKLMNXYZ[()*+,-`fsv{igM`7hwy`_gdwwvL)`POXU-]oYT[qP\\VOXU-]oYT[qQo[qp PPOXU-sUx]oYT(q.Qo+T+qOXU-sUx]oYT(qpPOXU-sUx]oYT(q.QoYT+q.pPOXU-sUx]oYT(q.QoYT*q.OXU-sUx]oYT(qpPOXU-sUx]oYT(q.QoYT)qP.OXU-sUx]oYT(qQoYTZqpPOXU-sUx]oYT(q.QoYT(qP.OXU-sUx]oYT(qQoYT[qpPOXU-sUx]oYT(q.QoYT[qP.OXU-sUx]oYT(qQoYT(qpPOXU-sUx]oYT(q.QoYTZqP.OXU-sUx]oYT(qQoYT)qpOXU-sUx]oYT(q.PP.OXU-sUx]oYT(qQoYT*qQp.PP.OXU-sUx]oYT(qQoYT+qp.Qp..PxxxxP.XoYT(qQoXTYq.QoXTYqPPZ)OXU)]pPZOXU(]pYoXTYqOXU-]QoXTYqOXU-]Q\\VQo[T[qPZ)OXU)]pPZOXU(]pYoXTYqOXU-]QoXTYqOXU-]QpPOXU-sUx]oYT(q.QoYT(q.PPZ)OXU)]pPZOXU(]pYoXTYqOXU-]QoXTYqOXU-]Q\\VQo[T[qPZ)OXU)]pPZOXU(]pYoXTYqOXU-]QoXTYqOXU-]QQ Q`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Z \xe5\xb0\x8f\xe6\x97\xb6`ee|_kphq`fjY.VY`Hciuz9jwbh`ql}i}v}b}jow|ud{y`j{vwcWcyy/ ucvwug1\"hzwcfs\"pj{vwcWad(/ ucvwug1\"sjuYV(Z9XY9\"pj{vwcWkwta/ ucvwug1\"jd,T jcft{g\"pj{vwcWad(/ ucvwug1\"ad(jVZXV,T ad(sV(XVZ\"pj{vwcWad(/ ucvwug1\"ad(jVZXVZ(XT ad(sV(XVZ\"pj{vwcWlUashfcg}s/ ucvwug1\"hzwcfsT jcft{g\"`5K5M`G=8965F_@5F;9_H<5B_=BB9F`vwl{:ch`fsv{igL`~sby{g`fsbyw`bvwf`uchb gY~/1`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 ( \xe5\xb0\x8f\xe6\x97\xb6`7CBB97H=B;`hwlhWla~`gus~w`wybszumh{~{t{g{jnca` FCWD`vwucvwv6cvmG{nw`m\\7hyncp} {i|}\\]`{qox1box~V`HCI7<_GH5FH`fUwj`{jsu`m`jbw`\xe8\xa7\xa6\xe6\x91\xb8\xe4\xba\x8b\xe4\xbb\xb6`@=?9@M_JA_G7F99B`HCI7<_9B8`EhK9wbtbyw{`D@IG_Y_<CIF`wfihbfd cfwugg`?9M6C5F8`dfwu{g{cb awv{iad x~csh/jsfm{by jwuZ jsfm{bHwl7ccfv{bshw/jc{v as{bPQ oy~_:fsy7c~cf1jwu(Pjsfm{bHwl7ccfv{bshwTXTYQ/q`gbc7gb~c8wtwyibT7gbccgw~fHusTwgbc:ufHwa{cwhiTggbb=wvwl8vGtchsfwybT@guc~shGfcysTwgbc@suG~chsfwysD~mscTvgbwGggc{GbchsfwybTGggw{gbchGfcysDwmsc~vsbThwdgfsw}Tfwbghsd}ffw:FT=gb{Gias~{hbcc7daw~whTvgb{KvbkcdCbwbTvgacTYgbcvZabTvgacT[gbcv(abTvgacT)__gb_Tb_5gddbwHvlwThcwwK6tcfgkfw`Dc{bhwf Id \xe4\xba\x8b\xe4\xbb\xb6\xe6\xb2\xa1\xe6\x9c\x89 Dc{bhwf Acjw \xe4\xba\x8b\xe4\xbb\xb6`ca=I8I`o 21 Qgwfihswx TwasBwasfx T~fiP`A98=IA_=BH`86@7@=7?`7cibh`~{b}Dfcyfsa`\xe5\x8f\xaf\xe8\x83\xbd\xe6\x98\xaf\xe8\x99\x9a\xe6\x8b\x9f\xe6\x9c\xba\xe5\xb1\x8f\xe5\xb9\x95P,XXl*XX \xe4\xbb\xa5\xe4\xb8\x8b\xe7\x9a\x84\xe5\xb1\x8f\xe5\xb9\x953Q`ez{cc`hb{fgwm6mHwd`\\oPVS3Q\\q`safcxfwD`jbwZh`_gdwwvM)`_$vt`Zvsc@wvc7bc{hsv{~sJya{`ys`Asu CG L`w`ACIG9_CIH`B=;<H_CK@`sguf{dh`ucvw`ufwshw8shs7zsbbw~`o-aeV{aI-ae-mfI(-ae-mfITwf}-gf}IYwa.aITwf}-gf}UP@A?@IYwa.aUP@A?@I[ayjgkg|l 3wV{aIVajw}afg -wfk UPI-.V{ala Za}~lI-.V{alaI-.YwalaI-.-gf}I-.Twf}kgf}IZa-mI3gm3mwfI-.2a~{aI-.4~gf}kgf}IT4-~m.aIT43wglaI-.QwaqmfI-.VmhgI-.ZalaI-.2af}cwaI-.2afo{aI`wjs`<HA@5buzcf9~wawbh`WWhz~a`\xe9\x9a\x90\xe8\x97\x8f\xe4\xb8\xad`tdUz{ghcfm`y{`ACIG9_@95J9`tt,Z}|`+++[+[[sZxZx`vfsy`xcf9suz`*[*,+Z*x*v*)`mhofhfiw`#x,Z`6vlt_c`hb{sD;JGThbwj9kc~xfwjCThbwaw~9bwymw?@AH<Thbwaw~9hw~dd5@AH<Tfw~~cfhbc7s{vwATbc{hdwul9zhsDLTbc{hdwul9`7c~~wuh;sftsyw`VY`Jwfg{cb\\WP\\vS\\V\\vSQ`A{ufcgcxhVLA@<HHDVYVX`DC=BH9F_@95J9`acn=bvwlwv86`_gdwwvM[`ixub{hbcQPfohwfi b{kvbkcyVhwc7dahivwhG~mPwzhg{VQwyDhcfwdhfJm~swi\"P{j{g{t{~mhQ\"q/`HH`caivw~`gvd`ib`\xe7\x89\xb9\xe6\xae\x8a\xe5\xb1\x8f\xe5\xb9\x95\xe5\xb0\xba\xe5\xaf\xb8P\xe5\xa6\x82\xe6\x8a\x98\xe5\x8f\xa0\xe5\xb1\x8fQ`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 YZ \xe5\xb0\x8f\xe6\x97\xb6`@;69K_F9F98B9F_89?G5ABI`{kvbkcV\\dcbw1 x bihuc{ bP\\fiT~x sfwasBwa TwxhsfigwQ\\`CB9_D5;9_J=9K9F`siwy`H56_9BH9F_?9M_G9EI9B79`ih`Ct|wuh`CG P\\vSOV_]\\vSQ`hfsbgxwfG{nw`\xe6\x96\xb0\xe6\x89\x8b. YU+ \xe5\xa4\xa9`gufc~~<w{yzh`ucbhfc~`(v)[(-()ZXZ,)u*(ZtZ-)uZw`bc{hsuc@wasf`N,L<>>MVta:XsLN~Fa~JmI<>PQ`D~wsgw wbst~w ucc}{w {b mcif tfckgwf twxcfw mci ucbh{biwV`~x~{uFhw`fwgkcf6EE`hqnq`Dc{bhwf Id \xe4\xba\x8b\xe4\xbb\xb6\xe5\x92\x8c\xe6\x9c\x80\xe5\x90\x8e\xe7\x9a\x84\xe7\xa7\xbb\xe5\x8a\xa8\xe4\xbd\x8d\xe7\xbd\xae\xe5\xa4\xaa\xe8\xbf\x9c`PsbmUdc{bhwf. x{bwQ`cb`KIw7`O\\f\\b\\h]`n5`wHhg`n_`UUUUU k{bvck_fwuh_Y UUUUU`w~ivcAb{sa`<9589FG_F979=J98`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89\xe9\x94\xae\xe7\x9b\x98\xe4\xba\x8b\xe4\xbb\xb6`PsbmUdc{bhwf`xfc~Phwl c  xYOZTQ]qo`\xe6\x99\x9a\xe4\xb8\x8aPY,UZZ \xe7\x82\xb9Q`DC=BH9F_ID`;wfh{Cbys{f~~I`r34ptlt|i [gdb|hx9gxhdakx34Fr`gw~dw`G9GG=CB_7CAA`ywbG`G9GG=CB_7CAA_B5J=;5H=CB`\xe4\xbc\x9a\xe8\xaf\x9d\xe9\x80\x9a\xe4\xbf\xa1\xe4\xba\x8b\xe4\xbb\xb6`@5GH_YZ_<CIFG`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 Y)UZY \xe5\xa4\xa9`ixub{hbcP  Qqo`twxcfwib~csv`zcjwfpcbUvwasbvpbcbwpsbm`ch~6tc`gy~`\xe5\x89\xaa\xe8\xb4\xb4\xe6\x9d\xbf\xe4\xba\x8b\xe4\xbb\xb6`W|sj`~i`sdggckvf`?9M6C5F8_ID`ghb{cDzuicHlsAga`:C7IG_=B`~ww`sffck`m7cbhfc~`ywhDfchchmdwCx`sddwbv`fst~`)x+[*(((*x*[`xfca`vst`g/obile`{gGwuifw7cbhwlh`uzsfy{byh{awuzsbyw`*,*Y*v*v*)+Z*,*)*Y*(+u*(*x*[+)*v`\xe6\x8b\x96\xe6\x8b\xbd\xe4\xba\x8b\xe4\xbb\xb6`<=889B_57H=J9`G>achgai7hhaTwasf:whswf7hha__`gufwwb@wxh`t9Tlihwutk`hy_wsvyf~_wwbahw{gv_`\xe8\xbe\x93\xe5\x85\xa5\xe6\xb3\x95\xe4\xba\x8b\xe4\xbb\xb6`}u{~7cBmvc`wv{g`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\x88\x86\xe9\x92\x9f`{vwbh{x{wf`qcev`P1XbsQm`Agla~ZVLA@<HHDV[VX`hbwhbc7`fj.P\\vS\\V\\vSQ`@5GH_(_<CIFG`fxjoepxEb`awhs`gwhH{aw`ywhFwsvwf`u~{wbh<w{yzh`zubis@hwFTcxb=fwgIwgs6hw;Twn{fczhi5Tb{yc@Tvwb{yc@g=Tv{Ahw;T8=A~sfwbw;hw;`hsc~:wgfsd`wuficGs{vwA`bx_ig~h{`|pn}4`5z~sd`vckb~{b}`whwf`G9GG=CB_7CAA_F9EI9GH_57H=J=HM`mafiz`suuw~wfsh{cb`?9M_8CKB_HC_ID_=BH9FJ5@_HCC_G<CFH`\xe6\x9c\x88\xe6\xb4\xbb\xe8\xb7\x83 Y(UZY \xe5\xa4\xa9`wi~t`F979BH_?9M6C5F8_9J9BHG`|tguzwaw.WW`w/gj{{~t{{.hzmv{wvdbc/h{wbwfjUhwgbc.bbkw{/zv.hlY/d{zyw.zYh/dhl.cUd----/d~lhw.x-U--l-/d`kwt}{h7cbbwuh{cb`bc{hu5vfcuwFfwvfcuwFhzy{fkms~d_Tbc{hu5afcxfwDfwvfcuwFhzy{fkms~d_TwaigwFhzy{fkms~d_Tfchuw~wGhwGfwvfcuwFhzy{fkms~d_TwhshGfwvfcuwFhzy{fkms~d_`DC=BH9F_8CKB`Agla~V8CA8cuiawbh`ywh5hhf{t@cush{cb`DE_H99_DC<?C`\xe8\x8f\x9c\xe5\x8d\x95\xe4\xba\x8b\xe4\xbb\xb6`vcuiawbhV`B9HKCF?`whw~dacuchisbc`\xe6\x9b\xb4\xe6\x96\xb0\xe4\xba\x8b\xe4\xbb\xb6`t~iwhcchz`ifc`Fwy9ld`85MG_Y)_ZY`qoQwPzuhsuq/wasbw~{x__ bfihwfomfh`~csvLA@`s8wh{Hwac:afhs`Ozha~]Vywh6cibv{by7~{wbhFwuhPQV`z%aswazfsw%v%Twhhgs7wxc7wfT%h%gw7hxs8w{fwj%f%Twhhgs7wxx=sfwaf8j{fwT%h%gw7hxs5whiachsc{%b`*x[v)(*x(-*w+(*)*+*)+Z(x+Z(-*w***-*w*-+(+-Z,+ZZ-`tixxwf8shs`,C`\xe5\xb9\xb3\xe5\x9d\x87\xe6\xaf\x8f\xe5\xa4\xa9\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 Y \xe5\xb0\x8f\xe6\x97\xb6`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 , \xe5\xb0\x8f\xe6\x97\xb6`WWftdisWjxc{buuVc{`9vyw\\WP\\vS\\V\\vSQ`+(*-*x*w`owzz_lae{gml`AG=9 P\\vS\\V\\vSQ`BCCB`=A9_7CADCG=H=CB_GH5FH`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe5\xb0\x8f\xe4\xba\x8e Y \xe5\x88\x86\xe9\x92\x9f`(x(x(t)x(w(x)((-(*(-())Z`u~{wbh wffcf`\"OI]\"`+Z+)*w+(*-*v*)`uw`N,L<>>MVBK9)BnF}M|zaMnA(PQ`)[*t+-+X`Gwbv`u~cgwv`UlkdyUs~gg`+Z*)+(+)+Z*wZX+(+-+X*)*x**ZX)x+[`vfsk5ffsmg`@CK_:@C5H`o \"{` dfdcha{ gv~swtxvc Tf 'uvicbahw~\\cVhu{s\\cVbwzxf`byw`Asu CG L P\\vSOV_]\\vSQ`uh`by9w`(V\\XO[UV] S;PpHAGGp<7UQ`b{ bkkvVchy7wdciavhGw~hwmzP{hVgyQDwfhwcfdJhsmw~Pi{\"gvsdm~/\"qQ`ufcggCf{y{b=gc~shwv`zhhd.\\\\`K;9@6w_tv_ifyvwwbff_wx{cb`jwbv`DC=BH9F_9BH9F`kkVkstv{VicuWa`igq4wnc3snnmprcb`dsywHcd`\xe8\xbe\x93\xe5\x85\xa5\xe4\xba\x8b\xe4\xbb\xb6`wbhUuzsfgwhTzsaa`wF~s~Dmsfw`\xe5\xbc\x80\xe5\xa7\x8b\xe4\xba\x8b\xe4\xbb\xb6`5|sl fwgdcbgw tcvm fwd~smT wldwuhwv GB. `k.gWW`U2ywhhwf.`O\\\\\\\"\\iXXXXU\\iXXYx\\iXX+xU\\iXX-x\\iXXsv\\iX*XXU\\iX*X(\\iX+Xx\\iY+t(\\iY+t)\\iZXXuU\\iZXXx\\iZXZ,U\\iZXZx\\iZX*XU\\iZX*x\\ixwxx\\ixxxXU\\ixxxx]`fcvbwj`kvwftw{fj`hk{gh`Ashz`cbwb`shs8hbwy5fwgi`\xe6\x9c\x80\xe8\xbf\x91\xe6\x9c\x89 Hst \xe5\x92\x8c 9bhwf \xe6\x8c\x89\xe9\x94\xae\xe5\xba\x8f\xe5\x88\x97`wxxwuh{jwHmdw`usuzw_`__vf`swa`asyw`whsb{afwh`7@=D6C5F8_7IH`~w`usuzw`vwj{uwach{cb`*[*Y+X+(+)+Z*)()+**)*w+(+[`=bjs~{v xcfash`:{F~wwwsfv`h bc{hubix ubmgs`Agla~ZVGwfjwfLA@<HHDV[VX`ufwshwCt|wuhGhcfw`uw~fs`b5fv{c v`\xe9\x9a\x90\xe8\x97\x8f&\xe6\xb4\xbb\xe8\xb7\x83`Dc{bhwf Id \xe4\xba\x8b\xe4\xbb\xb6\xe5\x9c\xa8\xe4\xb8\xad\xe5\xbf\x83\xe4\xbd\x8d\xe7\xbd\xae\xe7\x9a\x84\xe6\xa6\x82\xe7\x8e\x87\xe5\xbe\x88\xe9\xab\x98`D@IG_Y_A=BIH9`j{cvWw(a/dc vugw1uj\"us(YZVY99XaTd V((sZX\"V`bc{hsfs~uw8w~mhGGG7`hmffohwfi bkPb{cv kb{hgbswuxcK b{cvQkq/suuhPzQwqo`<=8=B;`H+5mHflcKl;v`U2Ovshs].`a+grr`F979BH_:I@@_7@=7?_G9EI9B79`githfww`c~vIF@`R`~1`_gdwwvY`QSv\\PW\\wacfz7`9LHF9A9_5GD97H_F5H=C`\xe5\x8f\xaf\xe8\xa7\x81\xe6\x80\xa7\xe5\x8f\x98\xe5\x8c\x96\xe4\xba\x8b\xe4\xbb\xb6`sgmbu`@FI`_b_y{hzsawf`whsi~sjwUfwj{fv`hFs@I`dsghw`\xe5\xb9\xb3\xe5\x9d\x87\xe4\xb8\x80\xe5\xa4\xa9\xe5\x86\x85\xe6\xb4\xbb\xe8\xb7\x83\xe6\x97\xb6\xe9\x97\xb4\xe8\xb6\x85\xe8\xbf\x87 YZ \xe5\xb0\x8f\xe6\x97\xb6`fsbywAsl`\xe6\xb4\xbb\xe8\xb7\x83`vw~hsM`O^Us]n[o_qsOnUUX]-ZoqZO_Us]n$R`ACIG9_9BH9F`<{{hwvbv`kzww~`vw~hsN`vcuiawbhVvcuiawbh9~wawbhV`wJgfc{\\b`hwghg`wgbz`~h7KGV~h7KG`hbrr5dws`O^5UNsUnXU-\\S\\W\\1]`.\\vS`l$T$i{w$T$$~gfT$`jF`sbvfc{v`\xe7\x84\xa6\xe7\x82\xb9\xe4\xba\x8b\xe4\xbb\xb6`bc{hswf7wasf`_gdwwv)`wffcf7cvw`zhhd`fchd{fugw8mhfwdcfDbkChwy`ueby_xaa{utR}al3~y}qfya~EfqdfFy}uR}al;~tujut64R}alDucguef3~y}qfya~8dq}u`H`bc{hsu{x{hcBzgid`jw`_gdwwv[`_ettvfy{`U2Oct|].`{6gsfwj`gufwwbVcf{wbhsh{cbV`~wgg`gixx{lwg`s~ishw`xcuig{b`P^\\gRQpP\\gR$Q`m}nyh )y{bch} 1hcKSiifdyttK2}l|yhyKX}fp}nc{y *}o} (0 ,li CE 0bchKnybigyK(W /gyln_X n}mn .}aofylKTY*,li=fcabnKX}fp}nc{y (0 DC (cabn Urn}h|}|KX}fp})_Yh|cyK/US.izini(cabn Rif|K+. )ibyhns 1hc{i|} .}aofylKTlic| /yhm 0bycK[yhhy|y /yhayg )*KTTS 1{b}hK{fi{eB@AF_pA>AK/ygmoha[yhhy|y.}aofylK)Y (Q*0Y*W Rif|K/ygmoha/yhm*ogC( (cabnKp}l|yhyKX}fp}nc{y*}o}0bchK/USVyffzy{eK/ygmohaUgidcK0}foao /yhayg )*KSyllicm Winbc{ /SKVfsg} (cabn .izini (cabnK/i)Q=Tcacn (cabnK/i)S /yhm .}aofylKX54c5oyhZKmmnKmygmoha=myhm=hogD0Kag_g}hag}haK(ibcn [yhhy|yKncg}m h}q ligyhKmygmoha=myhm=hogD(Km}lc~=gihimjy{}K/ygmoha/yhm*og=C0 0bchKSifil+/1Y=40bchKTlic| *ymeb /bc~n QfnK/ygmoha0}foao.}aofylKR}hayfc +0/K)Y (yh0cha_WR +onmc|} 5/KV6)cyi3o_WRAH@C@Kb}fp}=h}o}=l}aofylK//0 )}|cogKSiolc}l *}qK[bg}l )ih|ofeclc Rif|KX}fp}nc{y (0 BC 1fnly (cabn Urn}h|}|KX}fp}nc{y (0 BE 1fnly (cabnK.izini )}|cogKTlic| /yhm Rif|Kaio|sKmyhm=m}lc~={ih|}hm}|=fcabnK/Vch|}lKhini=myhm={de=g}|cogKgcocK).i{es ,.S Rif|KQh|lic|Sfi{e .}aofylK/ygmoha/yhm*og=D( (cabnKmyhm=m}lc~=nbchKQy,yha5y}lK{ymoyfKR* )ibyhns+0 Rif|Kr=mmnK*ini/yhm)syhgyl6yqascKX}fp}nc{y (0 CC 0bch Urn}h|}|KQmbf}s/{lcjn)0 QfnK*ini /yhm T}pyhyaylc 1YK.izini Sih|}hm}| Rif|K.izini )}|cog Ynyfc{Kgcoc}rK*ini /yhm Wolgoebc 1YK//0 2c}nhyg}m} (cabnK(W_+lcsyKbs{i~~}}Kr=mmn=ofnlyfcabnKTVX}cQ3G=QKV6634R0+0_1hc{i|}KT}pyhyaylc /yhayg )* Rif|Kmyhm=m}lc~=gihimjy{}K,y|yoe Riie Rif|K(W=V65chaRc[yc/bo=/AE=2B>BK(W=V65chaRc[yc/bo=/AE=2B>CKX}fp}nc{y*}o}(0 ,li CE 0bK)c{limi~n XcgyfysyK/ygmoha/yhmVyffzy{eK//0 )}|cog Ynyfc{KQh|lic|UgidcK/ygmoha/yhm*og=C.KY0S /nih} /}lc~Kmyhm=m}lc~=mgyff{yjmKr=mmn=g}|cogK(W_/chbyf}m}K.izini 0bch Ynyfc{K{}hnols=ainbc{KSfi{eijcyK(ogchiom_/yhmKVfilc|cyh /{lcjn QfnK*ini /yhm Wolgoebc Rif|K(0X5/6[ Rif|KW/_0bycK/ygmoha*}i*og_C0_BKQlyzc{Kbyhm=myhm=hilgyfK(ibcn 0}foaoKX5-cX}c=E@/ (cabnK(ch|m}s ~il /ygmohaKQ. Slsmnyfb}c TRK/ygmoha /yhm )}|cogKmygmoha=myhm=hogDEKbyhm=myhm=zif|K(ogchiom_/{lcjnK//0 Sih|}hm}|K/ygmohaT}pyhyaylc.}aofylKQhdyf )yfysyfyg )*K/ygmoha0byc8n}mn9KV6(yh0chaX}c=)=WRAH@C@KX}zl}q +0/KW/DE_Qlyz8Qh|lic|+/9K/ygmoha /yhm (cabnKSbi{i {iiesKb}fp}=h}o}=nbchK,* )ibyhns+0 )}|cogK(W=V6[y0iha=)AI=2B>DKTlic| /}lc~K/ygmoha/chbyfy.}aofylKb}fp}nc{yK(W=V6[y0iha=)AI=2B>BK*ini /yhm T}pyhyaylc 1Y Rif|K//0 (cabnKTV,UgidcKq}ynb}l~ihnh}q .}aofylK.izini*ogC.KTY*,li=g}|cogK/ygmoha /yhm *ogEEK//0 X}yps Ynyfc{K(Wfi{eD .}aofyl_@H@EKW}ilacyKhini=myhm={deK0}foao /yhayg )* Rif|K)Y1Y U4 *ilgyfKX5-cX}c=GE/ Rif|K*ini/yhm)syhgyl6yqasc Rif|Ksohimjli=zfy{eKb}fp}=h}o}=hilgyfK(ogchiom_/}lc~K0) )ibyhns+0 *ilgyfK/ygmoha/yhm*og=C(p (cabnK/ygmoha /yhm *ogDEK/gylnWinbc{ )}|cogKa}ilacyK{ymoyf=~ihn=nsj}K/ygmoha /yhm Rif|Kmgyff={yjcnyfmK)Vchyh{} ,.S Rif|KV6(yh0chaX}c_WRAH@C@K/ygmohaQlg}hcyhK.izini Rif|K{}hnols=ainbc{=zif|Kr=mmn=b}ypsK//0 (cabn Ynyfc{K0byl(ihKr=mmn=fcabnKTchzif .}aofylK/ygmohaR}hayfc.}aofylK[* )ibyhns+0/gyff )}|cogKbsjol}K/ygmoha0ygcf.}aofylK)yfysyfyg /yhayg )*K*ini /yhm [yhhy|y 1YKb}fp}=h}o}KX}fp}nc{y (0 EE .igyhK*ini /yhm [yhhy|y Rif|K/yhjsyK/ygmoha,ohdyzc.}aofylKmygmoha=myhm=hogD(pK(W_[yhhy|yK/ygmoha /yhm .}aofylK6yqasc=+h}KTlic| /}lc~ Rif| Ynyfc{KV6[Q0Z3K{iolc}l h}qK/ygmohaUgidc.}aofylK)Y1Y U4 Rif|KQh|lic| UgidcK*ini *ymeb Qlyzc{ 1YK(ST SigKVonoly )}|cog R0K2cpi=}rnly{nKRyhafy /yhayg )* Rif|Kbyhm=myhm=l}aofylK/*og=C.K/*og=C0Kbyhm=myhmK//0 1fnly (cabnK.izini .}aofylK.izini (cabnKXyhogyhKh}qfaainbc{KTVX}cQ3E=QKbyhm=myhm=fcabnK,fyn} Winbc{K/*og=C(KX}fp}nc{y (0 DE (cabnK)syhgyl /yhayg 6yqasc Rif|Kfa=myhm=m}lc~=fcabnK)Y1Y U4 (cabnK.izini 0bchK/i)Q Rif|K,y|yoeK/ygmoha /yhmK/jy{ciom_/gyffSyjKmyhm=m}lc~KT2 )ibyhns+0 )}|cogK/nyzf}_/fyjKgihy{iKVfsg}=(cabnK~ttsm=|imjsK/{l}}h/yhmK{fi{eB@AFK.izini Sih|}hm}| Rif| Ynyfc{KQlcyfK[* )ibyhns )}|cogK)inisy()ylo 3C gihiKXyh|m}n Sih|}hm}|K.izini Ynyfc{KX0S Xyh|K//0 1fnly (cabn Ynyfc{K//0 2c}nhyg}m} .igyhK*ini *ymeb Qlyzc{ 1Y Rif|K{bh~trb=g}|cogK/*ogSih|=C0K{}hnols=ainbc{=l}aofylK|}~yofn_lizini=fcabnK*ini /yhm )syhgylK)syhgyl /yhayg )*KQjjf} Sifil UgidcKq}ynb}l~ihn.}aK/ygmoha)yfysyfyg.}aofylKylcyfKTlic| /}lc~ Rif|KS,iC ,.S Rif|K)Y (Q*0Y*WK/ygmoha[il}yh=.}aofylKn}mnDE .}aofylKmjclcn_ncg}KT}pyhyaylc /yhayg )*K/{l}}h/}lc~K.iziniK{olmcp}=~ihn=nsj}K/0X}cnc_pcpiK{bh~trbK/ygmoha Sfi{eVihn CQK.izini Sih|}hm}| .}aofylKmygmoha=h}i=hogC.KWZ )ibyhns+0 )}|cogKSbofbi *}o} (i{eKlizini=hogC(Kb}fp}=h}o}=ofnly(cabn}rn}h|}|K/ygmoha+lcsy.}aofylK/ygmoha/yhm*og=D(p (cabnK)5chaX}c_AH@C@_SB=Rif|KTV,/byi*p3E=WRK.izini Rfy{eKb}fp}=h}o}=ofnlyfcabnKag_rcb}cK(Wfi{eD (cabn_@H@EKWodylync /yhayg )*K)yfysyfyg /yhayg )* Rif|Klizini=hogC.K/04cb}c_pcpiKV66boh5oyh_WRAH@C@Khini=myhm={de=fcabnK{ifilimK*ini /yhm WolgoebcK*ini /yhm /sgzifmK.izini (cabn Ynyfc{K(ibcn 0ygcfK{olmcp}K|}~yofn_liziniKRbymbcnySigjf}r/yhm Rif|K(W_*ogz}l_.izini 0bchKgihimjy{}|=qcnbion=m}lc~mKX}fp}nc{y (0 CE 0bchKmygmoha=myhm=hogC(2KTY*,liKZigifbylcKmyhm=m}lc~=fcabnKb}fp}=h}o}=zfy{eK(ibcn R}hayfcK)syhgyl /yhayg 6yqascKTlic| /}lc~ Ynyfc{K.izini Rif| Ynyfc{K*yhogWinbc{K/ihs )izcf} 1T Winbc{ .}aofylKW}ilacy Rif| Ynyfc{Kmygmoha=myhm=hogC(pKsohim=nbchKmygmoha=h}i=hogC0={ih|K*ini /yhm )syhgyl 1Y Rif|Kfam}lc~KV65ioX}c=.=WRAH@C@K(ibcn ,ohdyzcKzyme}lpcff}Kmygmoha=myhm=hogD0pKmygmoha=myhm=nbchK(W UgidcKQhdyfc*}q(cjcK/ygmoha/yhm*og=D0 0bchK/ygmoha[il}yh=Rif|Kgcoc}r=fcabnK*ini /yhm [yhhy|yK.izini *ilgyf Ynyfc{KW}ilacy Ynyfc{Kmyhm=m}lc~=g}|cogK/gyln 6yqascK.izini Sih|}hm}| Ynyfc{K*ini /yhm [yhhy|y 1Y Rif|KTV, /{ /yhm X}o}C@_A@CK(W_*ogz}l_.izini Rif|K,y|yoe RiieKr=mmn={ih|}hm}|K/ohmbch}=1{b}hK.izini Rfy{e Ynyfc{K.chai Sifil UgidcKT}pyhyaylc +0/K/gyln 6yqasc ,liKV6(yh0chaX}c=)=WR[KQh|lic|Sfi{e=(yla} .}aofylKjlijilncihyffs=mjy{}|=qcnbion=m}lc~mKSoncp} )ihiKncg}mK(W /gyln_X n}mn Rif|KTY*,li=(cabnKmyhm=m}lc~=zfy{eK(ibcn T}pyhyaylcKjlijilncihyffs=mjy{}|=qcnb=m}lc~mKmygmoha=myhm=hogC(K)5ioha ,.S )}|cogKTVWinbc{,3E=RYWEX[=/+*5Kbyhm=myhm=g}|cogK//0 X}ypsK(W=V66boh5oyh=)@B=2B>BK)syhgyl1*}q .}aofylK*ini *ymeb Qlyzc{ Rif|K/ygmohaWodylynbc.}aofylK~yhnymsKb}fp}=h}o}=fcabnKX}fp}nc{y *}o} +0/ Rif|Khini=myhm={de=zif|Kmygmoha=myhm=hogC.K(ch|m}s /ygmohaKmygmoha=myhm=hogC0K/{l}}h/}lc~)ihiKU0logj )syhgyl_63Kb}fp}=h}o}=nbch}rn}h|}|K*ini *ymeb Qlyzc{K(W_WodylyncK/gyln_)ihimjy{}|K0ygcf /yhayg )*K(W Ugidc *ihQ)UK.izini Sih|}hm}| (cabn Ynyfc{Kag_dchaeycKV6(yh0cha[yhX}c_WRAH@C@Kfanlyp}fKjyfynchiKW}ilacy Rif|KTlic| /yhmK(W_,ohdyzcK/gylnWinbc{ Rif|K/ygmoha /yhm 0bchK//0 Sih|}hm}| Rif|KSigc{m_*ylliqK{iolc}lK+lcsy /yhayg )*Kb}fp}=h}o}=fcabn}rn}h|}|KV6(yh0chaX}c=.=WRAH@C@KQ. Slsmnyfb}cX[/S/ TRKm}lc~K.03/5o}.io|WiW@pA=.}aofylK)cyi3o_jl}pKV65A[K(W_*ogz}l_.izini .}aofylKQh|lic|Sfi{eK/i)Q .}aofylKX5-cX}c=D@/ (cabnrKfa=myhm=m}lc~KTyh{cha /{lcjn Rif|K|}~yofnKm}{=lizini=fcabnKSifil+/1Y=.}aofylKn}mn .}aofylK0ygcf /yhayg )* Rif|KV65chaRc4cha/bo=/AFK.izini*ogC( (cabnKgihimjy{}|=qcnb=m}lc~mKmygmoha=myhm=hogCEKSiif dyttK/ygmoha*}i*og=C(K/04chaeycK/{l}}h/yhm)ihiKTV,3y3y3E=WRK/ygmoha/yhm*og=C( (cabnKRyhafy /yhayg )*KWolgoebc /yhayg )*K/US.izini(cabnKbs~ihrlychK)5chaX}cWRAH@C@S=Rif|Kmygmoha=myhm=fcabnKX}fp}nc{y (0 FE )}|cogKTlic| /yhm Vyffzy{eK.izini 0}mnA Rif|K*ini /yhm )syhgyl Rif|Kmyhm=m}lc~={ih|}hm}|={omnigK/ygmoha*}i*og=C0K/ygmoha /yhm *ogCEKgihimjy{}K0( )ibyhns )}|cogKb}fp}=h}o}=g}|cogK(0X5/6[K.izini Sih|}hm}| {omnig} Rif|K)syhgylCKTlic| /yhm T}pyhyaylcK/byi*p_jl}pKmygmoha=h}i=hogC(KV6(yh0chaX}c=U(=WR[KsohimKmygmoha=h}i=hogC0K0cg}m *}q .igyhKb}fp}=h}o}=zif|Khini=myhm={de=l}aofylK*ini /yhm Wolgoebc 1Y Rif|KTY*,li=zfy{eKV6(yh0chaX}c=U(=WRAH@C@K//0 2c}nhyg}m} )}|cogK.izini Sih|}hm}| (cabnK//0 2c}nhyg}m} Rif|KQ. TZ=[[KTlic| /yhm /U)SK*ini /yhm )syhgyl 1YKSigcha /iihK)5ojjs ,.S )}|cogK.im}gylsK(ibcn WodylyncK.izini Sih|}hm}| {omnig Rif|KV6(yh0chaX}c/=.=WRKX}fp}nc{y *}o} +0/K[ycnc_jl}pK.izini=RcaSfi{eKV65R[/Z3KXyh|m}n Sih|}hm}| Rif|K/ygmohaW}ilacyhKTyh{cha /{lcjnKmyhm=m}lc~={ih|}hm}|Kbyhm=myhm=nbchK/ygmoha/yhm*og=D0p 0bchK(ibcn +|cyKRbymbcnySigjf}r/yhm`vac`wf{x`b2j~,{jsy`siv{cWcyy/ ucvwug1\"jcft{g\"psiv{cWksj/ ucvwug1\"Y\"psiv{cWadwy/psiv{cWlUa(s/siv{cWssu/`mnyzf}`gbwGvbmPu;\"9IHGK_B=C8_K5A5B9;_F=K8BKCC_9D\"B`zf`lTmjnnrzgf`U2js~iw`bf_ v_f{sbwaq/suuhPzQwqo`D@IG_(_<CIFG`hsbywbh{s~Dfwggifw`F979BH_DC=BH9F_ACJ9_9J9BHG`ufwshw6ixxwf`HCI7<`$t_xwhuzEiwiw`tcc}gzw~x`xibuh{cb `;whFwgdcbgw<wsvwf`P Q21k b{cvVku_mfhdVcsfvbacII8=QP`uzsfsuhwfGwh`^X\\V`tsu}_xcfksfv`UUU`@@5_?59@V`*)+,+X*u*Y+-*-*w*+***u*Y*+`bcxy_ccgv`QQPq/XXY 2 s U QPwhs8 kwb bfihwf /fwyyitwv /QPwhs8 kwb 1 s `&&&`dx`s~h`=9`C1`\x09`c}`i~` Q`G1`\\x`\".` U `OL]`kf{hst~w`acvw`fwv`ut_`\\\"`g{ybs~`shhf{tihwC~vJs~iw`utt`sh`bc `uv`zu`wbiawfst~w`\"Q`\x0c`{y`\\`$_`''`{v`^`is`\\i`\\h`\r`\\\\`. `k.W`uzsfsuhwf8shs`Hst`VV`7GG`us~~ww`Zv`sbm`T `\n`B5`OA]`\x08`v~`$$`ud`ucbx{yifst~w` `\\b`\\t`W3`\\f";}else{_$km[3]=_$aF;}}else if(_$$L<76){if(_$$L===72){_$pG=_$my(_$kD);}else if(_$$L===73){_$lV+=-12;}else if(_$$L===74){_$$6=_$k7();}else{_$km[1]=_$$g;}}else{if(_$$L===76){ !_$i3?_$lV+=1:0;}else if(_$$L===77){_$n4.push(_$_C.substr(0,_$bU()%5));}else if(_$$L===78){ !_$i3?_$lV+=2:0;}else{_$a4(34,_$aq,_$n4);}}}else if(_$$L<96){if(_$$L<84){if(_$$L===80){_$km=_$ke.eval;}else if(_$$L===81){_$bH.push(_$a4(20,_$k7()*55295+_$k7()));}else if(_$$L===82){_$lV+=2;}else{_$n4.push("})(",'$_ts',".scj,",'$_ts',".aebi);");}}else if(_$$L<88){if(_$$L===84){_$_C='\n\n\n\n\n';}else if(_$$L===85){_$aE=_$pG().toString(16);}else if(_$$L===86){_$lV+=-6;}else{for(_$aq=0;_$aq<_$_q.length;_$aq+=100){_$aF+=_$_q.charCodeAt(_$aq);}}}else if(_$$L<92){if(_$$L===88){_$n4.push('}}}}}}}}}}'.substr(_$d0-1));}else if(_$$L===89){_$a4(74);}else if(_$$L===90){ !_$i3?_$lV+=17:0;}else{_$ea=_$aO(19);}}else{if(_$$L===92){_$ea=_$ke.execScript(_$nD);}else if(_$$L===93){_$i3=_$d0>0;}else if(_$$L===94){_$i3= !_$km;}else{_$i3=_$kG<_$nD;}}}else{_$iT=_$j$.length;}}}else ;}

function _$a4(_$n4,_$_S,_$aq){function _$im(_$_i,_$ea){var _$km,_$lo;_$km=_$_i[0],_$lo=_$_i[1],_$ea.push("function ",_$$g[_$km],"(){var ",_$$g[_$bw],"=[",_$lo,"];Array.prototype.push.apply(",_$$g[_$bw],",arguments);return ",_$$g[_$cK],".apply(this,",_$$g[_$bw],");}");}function _$bs(_$_i,_$ea){var _$km,_$lo,_$gN;_$ps(53,_$ea),_$km=_$b9[_$_i],_$lo=_$km.length,_$lo-=_$lo%2;for(_$gN=0;_$gN<_$lo;_$gN+=2)_$ea.push(_$bH[_$km[_$gN]],_$$g[_$km[_$gN+1]]);_$km.length!=_$lo?_$ea.push(_$bH[_$km[_$lo]]):0;}function _$p0(_$_i,_$ea,_$km){var _$lo,_$gN,_$kG,_$d0;_$kG=_$ea-_$_i;if(_$kG==0)return;else if(_$kG==1)_$bs(_$_i,_$km);else if(_$kG<=4){_$d0="if(",_$ea-- ;for(;_$_i<_$ea;_$_i++ )_$km.push(_$d0,_$$g[_$_s],"===",_$_i,"){"),_$bs(_$_i,_$km),_$d0="}else if(";_$km.push("}else{"),_$bs(_$_i,_$km),_$km.push("}");}else{_$gN=0;for(_$lo=1;_$lo<7;_$lo++ )if(_$kG<=_$_8[_$lo]){_$gN=_$_8[_$lo-1];break;}_$d0="if(";for(;_$_i+_$gN<_$ea;_$_i+=_$gN)_$km.push(_$d0,_$$g[_$_s],"<",_$_i+_$gN,"){"),_$p0(_$_i,_$_i+_$gN,_$km),_$d0="}else if(";_$km.push("}else{"),_$p0(_$_i,_$ea,_$km),_$km.push("}");}}function _$hy(_$_i,_$ea,_$km){var _$lo,_$gN;_$lo=_$ea-_$_i,_$lo==1?_$bs(_$_i,_$km):_$lo==2?(_$km.push(_$$g[_$_s],"==",_$_i,"?"),_$bs(_$_i,_$km),_$km.push(":"),_$bs(_$_i+1,_$km)):(_$gN= ~ ~((_$_i+_$ea)/2),_$km.push(_$$g[_$_s],"<",_$gN,"?"),_$hy(_$_i,_$gN,_$km),_$km.push(":"),_$hy(_$gN,_$ea,_$km));}var _$_i,_$ea,_$km,_$lo,_$gN,_$hX,_$ny,_$pe,_$bw,_$gY,_$cK,_$_s,_$am,_$_L,_$a_,_$b5,_$$A,_$gs,_$b9,_$cm,_$jk;var _$_q,_$pG,_$_C=_$n4,_$aE=_$$9[2];while(1){_$pG=_$aE[_$_C++];if(_$pG<76){if(_$pG<64){if(_$pG<16){if(_$pG<4){if(_$pG===0){_$gN=_$lo.test(_$ea);}else if(_$pG===1){_$b5=_$a4(0);}else if(_$pG===2){_$cm=0;}else{_$_i=new RegExp('\x5c\x53\x2b\x5c\x28\x5c\x29\x7b\x5c\x53\x2b\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x7d');}}else if(_$pG<8){if(_$pG===4){_$a2.jf= !_$km;}else if(_$pG===5){_$cK=_$k7();}else if(_$pG===6){_$lo=_$k7();}else{ !_$_q?_$_C+=-25:0;}}else if(_$pG<12){if(_$pG===8){_$ea=0;}else if(_$pG===9){_$ny=_$k7();}else if(_$pG===10){_$_s=_$k7();}else{_$b9=[];}}else{if(_$pG===12){for(_$km=0;_$km<_$_i;_$km++ ){_$ea[_$km]=_$k7();}}else if(_$pG===13){_$am=_$k7();}else if(_$pG===14){_$lo=new RegExp('\x37\x34');}else{_$gs[_$ea]=_$a4(0);}}}else if(_$pG<32){if(_$pG<20){if(_$pG===16){_$ps(6,_$aq,_$_S);}else if(_$pG===17){_$_i=_$j$.substr(_$ac,_$_S);_$ac+=_$_S;return _$_i;}else if(_$pG===18){_$_q=_$ea<_$b5.length;}else{_$_C+=1;}}else if(_$pG<24){if(_$pG===20){_$bH=_$bH.split(_$$8.fromCharCode(257));}else if(_$pG===21){_$_q= !_$b5;}else if(_$pG===22){_$ea+=2;}else{_$_q= !_$gN;}}else if(_$pG<28){if(_$pG===24){ ++_$km;}else if(_$pG===25){_$km=_$_i.test(_$ea);}else if(_$pG===26){ !_$_q?_$_C+=14:0;}else{_$_q=_$ea<_$lo;}}else{if(_$pG===28){_$km=_$km.join('');}else if(_$pG===29){_$_i=[];}else if(_$pG===30){_$ea=_$a4(0);}else{_$$s(_$b5,_$bU);}}}else if(_$pG<48){if(_$pG<36){if(_$pG===32){ !_$_q?_$_C+=-40:0;}else if(_$pG===33){_$jk=_$ps(0,_$kD);}else if(_$pG===34){ !_$_q?_$_C+=13:0;}else{_$ea=new _$lK(_$_i);}}else if(_$pG<40){if(_$pG===36){_$ea++ ;}else if(_$pG===37){_$_q= !_$b9;}else if(_$pG===38){_$_q=_$ea<_$gN;}else{return _$ea;}}else if(_$pG<44){if(_$pG===40){_$hX=_$k7();}else if(_$pG===41){_$bH=_$a4(20,_$k7());}else if(_$pG===42){_$mH[_$_S]=_$km;}else{_$km= --_$kD[1];}}else{if(_$pG===44){ !_$_q?_$_C+=7:0;}else if(_$pG===45){_$b9[_$ea]=_$a4(0);}else if(_$pG===46){_$_C+=-5;}else{_$km=_$a4(0);}}}else{if(_$pG<52){if(_$pG===48){_$gs=[];}else if(_$pG===49){_$j$="\"ŕfunction ā(ā){ā[ā(7,8)]=2-0;var ā=2;var ā=0;ā(4-2,8)]=1;}function ā){if(6){ā[4]=2;}ā[4]=3+1;ā[4]=ā(3,8)];if(7+5){ā[0]=6;}ā[0]=6;ā(3,8)];}function ā(3,8)];if(6){ā(3,8)];var ā=0;if(ā(7,8)]){if(2){ā(1,8)]=7;}}}function ā){var ā=7;if(ā(1,8)]=7;}}var ā=6;var ā=ā(5,8)];var ā=6-4;var ā=1;var ā(2,8)];}function ā[4]=2;ā[0]=ā(7,8)];if(3+1){ā[0]=6;}}\x00)),,)))	)\n)))\r)))))\n)))	))+))),))**),++)+,)\x00)**)***)))	))) )	)))!";}else if(_$pG===50){_$_L=_$a4(0);}else{_$_q= !_$ea;}}else if(_$pG<56){if(_$pG===52){_$ea=_$cP[_$cP()]();}else if(_$pG===53){ !_$_q?_$_C+=38:0;}else if(_$pG===54){_$pe=_$k7();}else{_$a_=_$a4(0);}}else if(_$pG<60){if(_$pG===56){_$_S.push(_$km);}else if(_$pG===57){_$_i.push([_$b5[_$ea],_$b5[_$ea+1]]);}else if(_$pG===58){_$b5=_$_i;}else{_$_q= !_$gs;}}else{if(_$pG===60){_$$A=_$k7();}else if(_$pG===61){ !_$_q?_$_C+=3:0;}else if(_$pG===62){_$$s(_$gs,_$bU);}else{return;}}}}else{if(_$pG<68){if(_$pG===64){_$gN=_$k7();}else if(_$pG===65){_$km=[];}else if(_$pG===66){_$lQ(_$ea,_$km);}else{_$ac=0;}}else if(_$pG<72){if(_$pG===68){_$_i=_$k7();}else if(_$pG===69){_$km= --_$kD[0];}else if(_$pG===70){_$bw=_$k7();}else{_$_q=_$km;}}else{if(_$pG===72){ !_$_q?_$_C+=1:0;}else if(_$pG===73){_$iT=_$j$.length;}else if(_$pG===74){_$_q= !(_$am+1);}else{_$gY=_$k7();}}}}else ;}

function _$ps(_$gN,_$kr,_$lo){function _$ea(){var _$_S=[3];Array.prototype.push.apply(_$_S,arguments);return _$iq.apply(this,_$_S);}function _$_i(){var _$_S=[0];Array.prototype.push.apply(_$_S,arguments);return _$iq.apply(this,_$_S);}var _$km;var _$d0,_$aq,_$kG=_$gN,_$n4=_$$9[3];while(1){_$aq=_$n4[_$kG++];if(_$aq<55){if(_$aq<16){if(_$aq<4){if(_$aq===0){ !_$d0?_$kG+=2:0;}else if(_$aq===1){ !_$d0?_$kG+=3:0;}else if(_$aq===2){ !_$d0?_$kG+=4:0;}else{_$kr.push("gger;");}}else if(_$aq<8){if(_$aq===4){_$kr.push("while(1){",_$$g[_$_s],"=",_$$g[_$am],"[",_$$g[_$hX],"++];");}else if(_$aq===5){_$d0=_$kr&65536;}else if(_$aq===6){return _$ea;}else{_$kr.push("}else ");}}else if(_$aq<12){if(_$aq===8){_$d0=_$_L.length;}else if(_$aq===9){_$d0=_$a_.length;}else if(_$aq===10){_$kG+=-17;}else{ !_$d0?_$kG+=5:0;}}else{if(_$aq===12){ !_$d0?_$kG+=-22:0;}else if(_$aq===13){ !_$d0?_$kG+=28:0;}else if(_$aq===14){_$d0=_$cm<=0;}else{_$kG+=1;}}}else if(_$aq<32){if(_$aq<20){if(_$aq===16){_$d0= !_$kr.length;}else if(_$aq===17){ !_$d0?_$kG+=-29:0;}else if(_$aq===18){for(_$km=1;_$km<_$a_.length;_$km++ ){_$kr.push(",",_$$g[_$a_[_$km]]);}}else{_$km=0;}}else if(_$aq<24){if(_$aq===20){ !_$d0?_$kG+=6:0;}else if(_$aq===21){_$cm-- ;}else if(_$aq===22){_$d0=_$$A<_$b9.length;}else{_$d0= !_$$g;}}else if(_$aq<28){if(_$aq===24){_$kr.push("}");}else if(_$aq===25){_$kr.push("function ",_$$g[_$gY],"(",_$$g[_$ny]);}else if(_$aq===26){_$kr.push(";");}else{return;}}else{if(_$aq===28){_$cm=_$jk();}else if(_$aq===29){_$hy(_$$A,_$b9.length,_$kr);}else if(_$aq===30){_$kr.push("){");}else{ !_$d0?_$kG+=19:0;}}}else if(_$aq<48){if(_$aq<36){if(_$aq===32){_$kr.push("if(",_$$g[_$_s],"<",_$$A,"){");}else if(_$aq===33){_$d0=_$km<_$_L.length;}else if(_$aq===34){return _$_i;}else{_$d0=_$lo==0;}}else if(_$aq<40){if(_$aq===36){ !_$d0?_$kG+=1:0;}else if(_$aq===37){ !_$d0?_$kG+=32:0;}else if(_$aq===38){ !_$d0?_$kG+=15:0;}else{_$km++ ;}}else if(_$aq<44){if(_$aq===40){_$d0=_$kr.length==0;}else if(_$aq===41){_$d0= !_$b5;}else if(_$aq===42){_$kG+=-5;}else{_$kr.push(_$$g[_$ny],",",_$$g[_$am],"=",_$$g[_$a0],"[",_$lo,"];");}}else{if(_$aq===44){_$p0(0,_$$A,_$kr);}else if(_$aq===45){_$kr.push("var ",_$$g[_$a_[0]]);}else if(_$aq===46){for(_$km=0;_$km<_$b5.length;_$km++ ){_$im(_$b5[_$km],_$kr);}for(_$km=0;_$km<_$gs.length;_$km++ ){_$lQ(_$gs[_$km],_$kr);}}else{_$d0=_$hX<0;}}}else{if(_$aq<52){if(_$aq===48){_$kr.push("var ",_$$g[_$pe],",",_$$g[_$_s],",",_$$g[_$hX],"=");}else if(_$aq===49){_$kr.push("debu");}else if(_$aq===50){_$kr.push(",",_$$g[_$_L[_$km]]);}else{_$d0=_$cm<64;}}else{if(_$aq===52){_$kr.push("(function(",_$$g[_$$6],",",_$$g[_$a0],"){var ",_$$g[_$ny],"=0;");}else if(_$aq===53){_$d0=_$b9.length;}else{ !_$d0?_$kG+=0:0;}}}}else ;}


function _$iq(_$_i){var _$km,_$gN,_$ea=_$_i,_$kG=_$$9[4];while(1){_$gN=_$kG[_$ea++];if(_$gN<4){if(_$gN===0){_$kr=0x3d3f*(_$kr&0xFFFF)+0x269ec3;}else if(_$gN===1){return;}else if(_$gN===2){return 64;}else{return(_$kr%10)+10;}}else ;}}}}}})([],[[4,0,2,5,10,3,1,7,9,11,6,8,],[29,27,55,28,95,41,15,45,47,49,67,4,61,40,63,73,58,14,17,7,17,91,69,43,62,65,13,39,84,26,51,24,49,77,79,50,86,64,21,12,23,27,20,94,21,88,30,83,6,35,90,32,75,18,19,53,96,46,70,56,54,0,48,74,10,52,9,38,57,34,87,71,72,85,16,59,42,11,90,26,5,93,76,33,31,2,40,26,51,24,68,81,50,22,1,44,36,8,17,60,76,17,3,78,92,82,80,25,37,17,66,89,17,17,],[68,35,51,34,50,55,1,29,8,18,61,57,22,46,58,21,53,12,39,63,17,63,49,73,67,68,41,20,30,65,66,28,56,63,40,9,54,70,75,5,10,13,74,32,62,64,11,8,38,61,45,36,46,37,26,31,60,47,42,6,48,8,27,61,15,36,46,59,7,2,33,16,63,63,3,52,25,71,44,43,14,0,23,72,24,19,69,4,63,],[5,0,34,15,6,27,28,35,37,52,40,13,48,23,31,8,20,19,33,1,50,39,42,30,41,54,46,9,1,45,18,26,16,12,43,53,38,4,47,2,10,25,40,17,32,44,7,22,36,29,26,24,27,21,14,11,28,51,0,49,3,27,],[0,3,1,2,1,],]);}


// 模拟同步代码结束后触发调度
load_fun();


function wait1SecSync() {
    window.done = false;
    deasync.loopWhile(() => !done);
    cookies = document.cookie
    return cookies
}
wait1SecSync()

function get_cookie() {
    cookies = document.cookie
    return cookies
};

function get_hz(type, url) {
    var xhr = new XMLHttpRequest;
    xhr.open(type, url, true);
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.send(null);
    return [window.xhrhead, window.url]
};

function get_hz_two(type, url, data) {
    var xhr = new XMLHttpRequest;
    xhr.open(type, url, true);
    xhr.send(data);
    return [window.xhrhead, window.url]
};