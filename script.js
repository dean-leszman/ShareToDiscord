let config = {};

/***************************************************************
 * Paste your config here.
 **************************************************************/
/*
    config.username = "username";
    config.menu = [{
        name: "Name",
        url: "",
        children: []
    }]
*/

/***************************************************************
 * End of config.
 **************************************************************/

const contexts = ["page", "link", "image", "video"];

function share(webhookUrl, data) {
    fetch(webhookUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error(error);
    });
}

function handleClick(url, info) {
    let data = {
        username: config.username ? config.username : "Stasis ShareToDiscord"
    };

    if ( info.linkUrl ) {
        data.content = info.linkUrl;
    } else if ( info.pageUrl ) {
        data.content = info.pageUrl;
    } else if ( info.mediaType && info.mediaType === "video" ) {
        data.content = info.srcUrl;
    }

    share(url, data);
}

function parseContextMenuItem(item, id, parentId = null) {
    chrome.contextMenus.create({
        title: item.name,
        contexts: contexts,
        onclick: item.url ? (info) => { handleClick(item.url, info); } : null,
        id: id.toString(),
        parentId: parentId !== null ? parentId.toString() : null
    });

    if (item.children && item.children.length > 0) {
        item.children.map((childItem, index) => {
            parseContextMenuItem(childItem, `${id}-${index}`, id);
        });
    }
}

config.menu.map((item, index) => {
    parseContextMenuItem(item, index);
});