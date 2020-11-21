module.exports = () => {
    return {
        'nav-items': navItems,
        'resources': resources,
    }
}

const navItems = [
    {
        label: 'navItems.fileExplorer',
        url: 'file-explorer'
    }
];

const resources = (function () {
    const result = [];
    let folderId = 1;
    let fileId = 1;

    const insertChildren = () => {
        const children = [];
        for (let i = 1; i <= 5; i++) {
            children.push({
                id: fileId,
                name: `Sub File ${i}`,
                type: 'FILE',
                size: Math.round(Math.random() * 10000000)
            })
        }
        fileId++;
        return children;
    }

    for (let i = 1; i <= 20; i++) {
        if (i % 2 === 0) {
            result.push({
                id: folderId,
                name: `Folder ${folderId}`,
                type: 'FOLDER',
                size: 0,
                hidden: false,
                children: insertChildren()
            });
            folderId++;
        } else {
            result.push({
                id: fileId,
                name: `${'File'} ${fileId}`,
                type: 'FILE',
                size: Math.round(Math.random() * 10000000),
                hidden: false,
                children: []
            });
            fileId++;
        }
    }

    return result;
})() 