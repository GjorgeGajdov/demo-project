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
    let folderId = 0;
    let fileId = 0;

    const createNode = (id, name, type, children) => ({
        id: id,
        name: name,
        type: type,
        dateCreated: new Date(),
        hidden: false,
        size: type === 'FOLDER' ? 0 : Math.round(Math.random() * 10000000),
        children: children
    })

    const getChildren = () => {
        const children = [];
        for (let i = 1; i <= 15; i++) {
            if (i % 2 === 0) {
                folderId++;
                children.push(createNode(folderId, `Sub Folder ${folderId}`, 'FOLDER'));

            } else {
                fileId++;
                children.push(createNode(fileId, `Sub File ${fileId}`, 'FILE'));
            }
        }
        return children;
    }

    for (let i = 1; i <= 20; i++) {
        if (i % 2 === 0) {
            folderId++;
            result.push(createNode(folderId, `Folder ${folderId}`, 'FOLDER', getChildren()));
        } else {
            fileId++;
            result.push(createNode(fileId, `File ${fileId}`, 'FILE'));
        }
    }

    return result;
})() 