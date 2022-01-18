(() => {
    let finishdUpdateNotify = false;
    const defaultMethod = 'POST';
    const expectedVersion = 'v0.1.1';

    let toVRC = (url, method = defaultMethod) => {
        fetch('http://localhost:11400/url', {
            method: method,
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        }).then((res) => {
            console.log(res.headers)
            alert(res.headers.get("X-VERSION"))
            if (res.headers.get('X-VERSION') !== expectedVersion) {
                if (!finishdUpdateNotify && confirm('please update send_vrc_desktop')) {
                    finishdUpdateNotify = true;
                    window.open('https://bootjp.booth.pm/items/3572196')
                }
            }
        }).catch((e) => {
            console.warn(e);
            if (method == defaultMethod) {
                toVRC(url, 'PUT');
            }
        });
    }

    chrome.contextMenus.create({
        title: 'SendVRC this page',
        type: 'normal',
        contexts: ['page'],
        onclick: (info, tab) => {
            if (!info || !info['pageUrl']) {
                return;
            }
            const pageURL = info['pageUrl'];
            toVRC(pageURL);
        }
    })

    chrome.browserAction.onClicked.addListener((e) =>{
        if (!e || !e['url']) {
            return;
        }
        toVRC(e['url'])
    });
})()