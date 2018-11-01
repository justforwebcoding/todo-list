let model = (function() {
    function Todo(id, value, status) {
        this.id = id;
        this.value = value;
        this.status = status;
    }

    let data = [];


    return {
        add: function(value) {
            let todo, id;


            if(data.length > 0) {
                id = data[data.length-1].id + 1;
            } else {
                id = 0;
            }

            todo = new Todo(id, value, false);

            data.push(todo);

            this.testing();

            return todo;
        },

        delete: function(value) {
            data = data.filter(function (current) {
                return current.id !== +value;
            });
            this.testing();
        },

        toggle: function(value) {
            data.forEach(function(current) {
                if(current.id === value) {
                    current.status = !current.status;
                }
            });
            this.testing();
        },

        render: function(value) {
            let resultData = [];
            if(value === '0') {
                resultData = data.filter(function (item) {
                    return item;
                });
            } else if (value === '1') {
                resultData = data.filter(function (item) {
                    if(!item.status) {
                        return item;
                    }
                });
            } else if (value === '2') {
                resultData = data.filter(function (item) {
                    if(item.status) {
                        return item;
                    }
                });
            }

            return resultData;
        },

        testing: function() {
            console.log(data);
        }
    }

})();

let view = (function() {

    let DOMstrings = {
        addBtn: '.todo-btn',
        inputBtn: '.todo-text',
        todoList: '.todo-list',
        buttonList: '.buttons'
    };


    return {
        getInfo: function() {
            return  document.querySelector(DOMstrings.inputBtn).value;
        },

        renderAll: function(dataArr) {
            let html, container, renderItem;
            html = '';
            container = DOMstrings.todoList;
            renderItem = document.querySelector(container);

            dataArr.forEach(function (item) {
                if(item.status === true) {
                    html += `<li id="${item.id}" class="todo-list__item checked">${item.value}<span class="close"></span></li>`;
                } else {
                    html += `<li id="${item.id}" class="todo-list__item">${item.value}<span class="close"></span></li>`;
                }
            });
            renderItem.insertAdjacentHTML('beforeend', html);

        },

        clearAll: function() {
            document.querySelector(DOMstrings.todoList).innerHTML = '';
        },

        addItem: function(obj) {
            let html, container;

            container = DOMstrings.todoList;

            html = `<li id="${obj.id}" class="todo-list__item">${obj.value}<span class="close"></span></li>`;

            document.querySelector(container).insertAdjacentHTML('beforeend', html);

        },

        deleteItem: function(value) {
            document.querySelector(DOMstrings.todoList).removeChild(value);
        },


        clearField : function () {
            document.querySelector(DOMstrings.inputBtn).value = '';
        },

        toggleItem: function(element) {
            element.classList.toggle('checked');
        },

        getDOMstrings: function() {
            return DOMstrings;
        }

    }

})();

let controller = (function(DATA, UI) {

    let status = '';

    let setUpListeners = function() {
        let DOM = UI.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', fullAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                fullAddItem();
            }
        });

        document.querySelector(DOM.todoList).addEventListener('click', fullDeleteItem);
        document.querySelector(DOM.todoList).addEventListener('click', checkItem);

        document.querySelector(DOM.buttonList).addEventListener('click', renderBtn);
    };

    let fullAddItem = function() {
        let input, newItem;

        //Get input field
        input = UI.getInfo();

        //Add item to model
        newItem = DATA.add(input);

        //Add item to UI
        if(status.toString() !== '2') {
            UI.addItem(newItem);
        }

        //Clear fields
        UI.clearField();


    };

    let fullDeleteItem = function (e) {
        let ID, element;

        if(e.target.classList.contains('close')) {
            element = e.target.parentNode;
            ID = element.id;

            //1. When clicked delete from data
            DATA.delete(ID);
            //2. Delete from UI
            UI.deleteItem(element);

        }
    };

    let checkItem = function (e) {
        let element, ID;

        if(e.target.classList.contains('todo-list__item')) {
            element = e.target;
            ID = parseInt(element.id);

            //1. Check item in data
            DATA.toggle(ID);
            //2. Check item in UI
            UI.toggleItem(element);

            if(status.toString() === '2' || status.toString() === '1') {
                UI.deleteItem(element);
            }

        }


    };

    let renderBtn = function (e) {
        let ID, element, newData;
        element = e.target;
        if (element.tagName === 'BUTTON') {
            ID = element.parentNode.id.split('-')[1];
            render(ID);
        }


    };

    let render = function(id) {
        console.log(id);
        status = status.toString();
        let newData = DATA.render(id);
        switch(id) {
            case '0':
                if(status !== '0') {
                    UI.clearAll();
                    UI.renderAll(newData);
                    status = '0';
                    console.log(status);
                    console.log(newData);
                }
                break;
            case '1':
                if(status !== '1') {
                    UI.clearAll();
                    UI.renderAll(newData);
                    status = '1';
                    console.log(status);
                    console.log(newData);
                }
                break;
            case '2':
                if(status !== '2') {
                    UI.clearAll();
                    UI.renderAll(newData);
                    status = '2';
                    console.log(status);
                    console.log(newData);
                }
                break;
            default:
                break;
        }

    };


    return {
        init: function() {
            console.log('app begin');
            setUpListeners();
        }
    }

})(model, view);

controller.init();
