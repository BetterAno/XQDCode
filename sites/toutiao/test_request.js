/**
 * 今日头条 API 请求测试脚本
 * 
 * 使用生成的 a_bogus 参数请求科技频道文章列表
 */

const https = require('https');
const { generateABogus, buildRequestUrl } = require('./abogus_generator');

/**
 * 发送 HTTP GET 请求
 */
function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://www.toutiao.com/',
                'Origin': 'https://www.toutiao.com',
                'Cookie': options.cookie || '',
                ...options.headers
            }
        };

        console.log('\n📤 发送请求...');
        console.log('URL:', url);
        console.log('Headers:', JSON.stringify(requestOptions.headers, null, 2));

        const req = https.request(requestOptions, (res) => {
            let data = '';
            
            console.log('📥 响应状态:', res.statusCode);
            console.log('📥 响应头:', JSON.stringify(res.headers, null, 2));

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

/**
 * 获取科技频道文章列表
 */
async function getTechArticles() {
    console.log('========== 今日头条科技频道文章获取 ==========');
    
    // 1. 准备请求参数
    const params = {
        offset: 0,
        channel_id: '94349549395',  // 科技频道 ID
        max_behot_time: 0,
        category: 'pc_profile_channel',
        disable_raw_data: true,
        aid: 24,
        app_name: 'toutiao_web',
        msToken: '8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc='
    };

    // 2. 配置
    const config = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
        cookie: 'ttwid=1|xxx; msToken=8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc='
    };

    // 3. 生成 a_bogus
    console.log('\n🔐 生成 a_bogus 签名...');
    const aBogus = generateABogus(params, config.userAgent);

    // 4. 构造完整 URL
    const baseUrl = 'https://www.toutiao.com/api/pc/list/feed';
    const fullUrl = buildRequestUrl(baseUrl, params, aBogus);

    // 5. 发送请求
    try {
        console.log('\n🌐 开始请求科技频道文章...');
        const response = await httpRequest(fullUrl, config);

        // 6. 解析并显示结果
        if (response.data && response.data.length > 0) {
            console.log('\n✅ 请求成功！获取到', response.data.length, '篇文章\n');
            console.log('========== 文章列表 ==========');
            
            response.data.forEach((article, index) => {
                console.log(`\n${index + 1}. ${article.title}`);
                console.log(`   作者: ${article.source || '未知'}`);
                console.log(`   时间: ${article.behot_time ? new Date(article.behot_time * 1000).toLocaleString('zh-CN') : '未知'}`);
                console.log(`   链接: https://www.toutiao.com/article/${article.article_id || article.gid}/`);
                
                if (article.tag) {
                    console.log(`   标签: ${article.tag}`);
                }
            });
            
            console.log('\n========== 获取完成 ==========');
        } else if (response.message) {
            console.log('\n❌ 请求失败:', response.message);
            console.log('响应数据:', JSON.stringify(response, null, 2));
        } else {
            console.log('\n⚠️ 未获取到文章数据');
            console.log('响应:', JSON.stringify(response, null, 2).substring(0, 500));
        }

    } catch (error) {
        console.error('\n❌ 请求出错:', error.message);
        console.error('错误详情:', error);
    }
}

// 运行
if (require.main === module) {
    getTechArticles().catch(console.error);
}

module.exports = {
    httpRequest,
    getTechArticles
};
