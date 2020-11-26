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
    let id = 0;

    const getName = () => id % 2 ? `File ${id}` : `Folder ${id}`;
    const getType = () => id % 2 ? 'FILE' : 'FOLDER';
    const createNode = (id, name, type) => ({
        id: id,
        name: name,
        type: type,
        dateCreated: new Date(),
        size: type === 'FOLDER' ? 0 : Math.round(Math.random() * 10000000),
        children: []
    })

    for (let i = 0; i < 10; i++) {
        id++;
        const node = createNode(id, `Folder ${id}`, 'FOLDER');
        result.push(node);
        for (let j = 0; j < 5; j++) {
            id++;
            const node2 = createNode(id, getName(), getType());
            node.children.push(node2);
            if (node2.type === 'FOLDER') {
                for (let j = 0; j < 2; j++) {
                    id++;
                    const node3 = createNode(id, getName(), getType());
                    node2.children.push(node3);
                    if (node3.type === 'FOLDER') {
                        for (let j = 0; j < 2; j++) {
                            id++;
                            const node4 = createNode(id, getName(), getType());
                            node3.children.push(node4);
                        }
                    }
                }
            }
        }
    }

    return result;
})();

const flatResources = (function () {
    let id = 1;
    let parentId = null;

    const getName = () => id % 2 ? `File, ${id}` : `Folder, ${id}`;
    const getType = () => id % 2 ? 'FILE' : 'FOLDER';
    const createNode = (id, name, type, parentId) => {
        return {
            id: id,
            name: name,
            type: type,
            dateCreated: new Date(),
            size: type === 'FOLDER' ? 0 : Math.round(Math.random() * 10000000),
            parentId: parentId
        }
    };

    for (let i = 0; i < 100; i++) {
        id++;
        createNode(id, `Folder, ${id}`, 'FOLDER');
        parentId = id;
        for (let j = 0; j < 20; j++) {
            id++;
            createNode(id, getName(), getType(), parentId);
            parentId = id;
            for (let k = 0; k < 10; k++) {
                id++;
                createNode(id, getName(), getType(), parentId);
                parentId = id;
                for (let n = 0; n < 5; n++) {
                    id++;
                    createNode(id, getName(), getType(), parentId);
                    parentId = id;
                    for (let m = 0; m < 2; m++) {
                        id++;
                        createNode(id, getName(), getType(), parentId);
                        parentId = null;
                    }
                }
            }
        }
    }
})();