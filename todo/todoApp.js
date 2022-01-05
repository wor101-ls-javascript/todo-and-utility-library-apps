"use strict";

// Todo Data
let todoData1 = {
  title: 'Buy Milk',
  month: '1',
  year: '2017',
  description: 'Milk for baby',
};

let todoData2 = {
  title: 'Buy Apples',
  month: '',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

let todoData3 = {
  title: 'Buy chocolate',
  month: '1',
  year: '',
  description: 'For the cheat day',
};

let todoData4 = {
  title: 'Buy Veggies',
  month: '',
  year: 'Twenty Twenty One',
  description: 'For the daily fiber needs',
};

let todoData5 = {
  title: '',
  month: '',
  year: '201',
};

let todoData6 = {
  title: 42,
  month: '',
  year: undefined,
  description: false,
};

let todoData7 = {
  month: '6',
  year: 1995,
  description: 42,  
};

let todoSet = [todoData1, todoData2, todoData3, todoData4, todoData5, todoData6, todoData7];

class Todo {
  constructor(obj, newId) {
    this.id = newId;
    this.title = Todo.validateTitle.call(this, obj.title);
    this.completed = Todo.validateCompleted(obj.completed);
    this.month = Todo.validateMonth(obj.month);
    this.year = Todo.validateYear(obj.year);
    this.description = Todo.validateDescription(obj.description);
  }

  isWithinMonthYear(month, year) {
    return (month.toString() === this.month && year.toString() === this.year);
  }
}

Todo.validateTitle = function(title) {
  if (title) {
    return title.toString();
  } else {
    return this.id.toString();
  }
}

Todo.validateCompleted = function(completed) {          
  if (completed && (completed === true || completed.match(/^true$/i) )) {      
    return true;
  } else {
    return false;
  }
}

Todo.validateMonth = function(month) {
  let validMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  month = typeof month === 'number' ? month.toString() : month;

  if(validMonths.includes(month)) {
    return month;
  } else {
    return new Date().getMonth().toString();
  }
}

Todo.validateYear = function(year) {
  if (year) {
    let stringYear = year.toString();
    let nonIntegerArray = stringYear.match(/[\D]/g);
    if (stringYear.length === 4 && nonIntegerArray === null) {
      return stringYear;
    }    
  } 
  return new Date().getFullYear().toString();
}

Todo.validateDescription = function(description) {
  if (typeof description === 'string') {
    return description;
  } else if (typeof description === 'number') {
    return description.toString();
  } else {
    return '';
  }
}

let todoList = (function() {
  const VALID_PROPERTIES = ['Title', 'Completed', 'Month', 'Year', 'Description'];
  
  function counter(){
    let count = 0;
    return function() {
      count += 1;
      return count;
    }
  }

  function resetList() {
    generateId = counter();
    todos = [];
  }

  function copyTodo(todo) {
    let copy = new Todo(todo, todo.id);
    return copy;
  }

  function retrieveTodoById(id) {
    return todos.find(todo => todo.id === id);
  }

  function validId(id) {
    let ids = todos.map(todo => todo.id);
    return ids.includes(id);
  }

  function getIndex(idToFind) {
    return todos.findIndex(todo => todo.id === idToFind);
  }

  function validateProperties(obj) {    
    VALID_PROPERTIES.forEach(prop => {
      if (obj[prop.toLowerCase()]) {
        obj[prop.toLowerCase()] = Todo['validate' + prop](obj[prop.toLowerCase()]);
      }
    });
    return obj;
  }

  function validTodoData(dataObj) {
    let lowerCaseProperties = VALID_PROPERTIES.map(prop => prop.toLowerCase());
    let validPropertyIncluded = false;

    Object.keys(dataObj).forEach(key => {
      if (lowerCaseProperties.includes(key)) {
        validPropertyIncluded = true;
      }
    });
    return validPropertyIncluded;
  }

  let todos = []
  let generateId = counter();

  return {
    add(obj) {
      if (validTodoData(obj)) {
        let newId = generateId();
        todos.push(new Todo(obj, newId));
        return this.get(newId);
      } else {
        return false;
      }
    },

    delete(id) {
      if (validId(id)) {
        let deletedTodo = todos.splice(getIndex(id), 1)[0];
        return copyTodo(deletedTodo);
      } else {
        return false;
      }
    },

    update(id, obj) {
      if (validId(id) && validTodoData(obj)) {
        let todo = retrieveTodoById(id);
        obj = validateProperties(obj);

        for (let prop in todo) {
          if (obj[prop] && prop !== 'id') { 
            todo[prop] = obj[prop] 
          };
        }
        return copyTodo(todo);
      } else {
        return false;
      }
    },

    get(id) {
      if (id) {
        return validId(id) ? copyTodo(retrieveTodoById(id)) : false; 
      } else {
        let todosCopy = [];
        todos.forEach(todo => todosCopy.push(copyTodo(todo)));
        return todosCopy;
      }
    },

    init(todoData) {
      let arrayElementsHaveValidProperties = function () { 
        return todoData.every(todo => validTodoData(todo))
      };

      if (Array.isArray(todoData) && arrayElementsHaveValidProperties()) {
        resetList();
        todoData.forEach(obj => this.add(obj));
      } else {
        return null;
      }
    },    
  };
})();

todoList.init(todoSet);

let todoManager = (function() {
  function validTodoList(todos) {
    return (todos === todoList || todoList.isPrototypeOf(todos));
  }

  return {
    allTodos(todos) {
      return validTodoList(todos) ? todos.get() : null;
    },
  
    completedTodos(todos) {
      if (validTodoList(todos)) {
        return todos.get().filter(todo => todo.completed === true);
      } else {
        return null;
      }      
    },
  
    withinMonthYear(todos, month, year) {
      if (validTodoList(todos)) {
        return todos.get().filter(todo => todo.isWithinMonthYear(month, year));
      } else {
        return null;
      }
    },

    completedWithinMonthYear(todos, month, year) {
      if (validTodoList(todos)) {
        let todosWithin = this.withinMonthYear(todos, month, year);
        return todosWithin.filter(todo => todo.isWithinMonthYear(month, year));
      } else {
        return null;
      }
    },
  };
})();

// test cases

// todoList tests
  // confirm todoList collection 'todos' is not available from outside todoList
  console.log(todoList.todos === undefined);
  try {
    console.log(todoList.todos.push('no access'));
  } catch(err) {
    console.log(err.name === 'TypeError')
  }  
  
  // confirm 'get' when supplied with an id returns copy of a todo or false if id invalid
  (function() {
    let todo4 = todoList.get(4);
    console.log(todo4.id === 4 && todo4.title === 'Buy Veggies');
    console.log(todoList.get(44) === false);
  })();

  // confirm 'get' returns an array with copies of all 'todo' objects in 'todos'
  (function() {
    let mutateTodo = todoList.get()[0];
    mutateTodo.id += 10;
    mutateTodo.title = 'Sell Milk';
    let unMutatedTodo = todoList.get()[0];
    console.log(mutateTodo !== unMutatedTodo);
    console.log(unMutatedTodo.id !== mutateTodo.id && 
                unMutatedTodo.title !== mutateTodo.title);
  })();

  // confirm 'add' method adds a new todo AND returns a copy of the todo
  (function() {
    let initialTodosLength = todoList.get().length;
    let newTodoCopy = todoList.add({title: 'Clean Kitchen', month: '9', year: '2021', 
                                 description: 'clean counters and dirty dishes'})

    // confirm 'add' added an additional object to 'todos'
    console.log(todoList.get().length === initialTodosLength + 1);

    // confirm a copy was returned
    console.log(newTodoCopy.title === 'Clean Kitchen' && newTodoCopy.id !== undefined);
    newTodoCopy.title = 'Dirty Kitchen';
    console.log(todoList.get(newTodoCopy.id).title === 'Clean Kitchen');
  })();

  // confirm 'add' returns false when provided a invalid 'todo'
  (function() {
    let invalidObj = { badProperty: 'undefined', irrelevant: 'false'};
    console.log(todoList.add(invalidObj) === false);
  })();

  // confirm 'delete' removes a todo using 'id'
  (function() {
    let initialTodosLength = todoList.get().length;
    todoList.delete(initialTodosLength - 1);
    let newTodosLength = todoList.get().length;
    console.log(initialTodosLength === newTodosLength + 1);
    console.log(todoList.get(initialTodosLength - 1) === false);
  })();

  // confirm 'delete' returns false if 'id' is not valid
  (function() {
    let initialTodosLength = todoList.get().length;
    console.log(todoList.delete(initialTodosLength) === false);
    console.log(initialTodosLength === todoList.get().length);
  })();

  // confirm 'update' updates a todo with only valid properties
  (function() {
    let updatedProperties = { title: 'newTitle', year: 2021, completed: 'true', 
    description: 'fancy description', badProperty: 'badData'};
    let updatedTodo = todoList.update(8, updatedProperties);

    console.log(updatedTodo.id === 8 && updatedTodo.title === 'newTitle' && 
    updatedTodo.year === '2021' && updatedTodo.completed === true &&
    updatedTodo.description === 'fancy description');
  })();

  // confirm 'update' will not alter and id
  (function() {
    let updatedProperties = { id: 88, title: 'badId', year: 2021, completed: 'true', 
    description: 'fancy description', badProperty: 'badData'};
    let updatedTodo = todoList.update(8, updatedProperties);

    console.log(updatedTodo.id === 8 && updatedTodo.title === 'badId' && 
    updatedTodo.year === '2021' && updatedTodo.completed === true &&
    updatedTodo.description === 'fancy description');
  })();

  // confirm 'update' returns false if invalid argument give
  (function() {
    let stringArgument = 'invalid';
    let objWithBadProperties = { badProperty: 'false', none: 'undefined' };
    console.log(todoList.update(1, stringArgument) === false);
    console.log(todoList.update(1, objWithBadProperties) === false);
  })();

// Todo constructor tests
  // confirm IDs are unique
  (function() {
    let allIds = todoList.get().map(todo => todo.id);
    console.log(allIds.every(id => allIds.indexOf(id) === allIds.lastIndexOf(id)));
  })();

  // confirm IDs are all numbers
  (function() {
    let allIds = todoList.get().map(todo => todo.id);
    console.log(allIds.every(id => typeof id.valueOf() === 'number')); 
  })();

  // confirm titles are all strings
  (function() {
    let todoTitles = todoList.get().map(todo => todo.title);
    console.log(todoTitles.every(title => typeof title === 'string'));
  })();
  
  // confirm titles are not empty strings
  (function() {
    let todoTitles = todoList.get().map(todo => todo.title); 
    console.log(todoTitles.every(title => title !== ''));
  })();

  // confirm months are all strings
  (function() {
    let todoMonths = todoList.get().map(todo => todo.month);
    console.log(todoMonths.every(month => typeof month === 'string'));
  })(); 

  // confirm months contain a valid string representation of the integer month
  (function() {
    let todoMonths = todoList.get().map(todo => todo.month);
    let validMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    console.log(todoMonths.every(month => validMonths.includes(month)));
  })();

  // confirm years are all strings with a length of 4
  (function() {
    let todoYears = todoList.get().map(todo => todo.year);
    console.log(todoYears.every(year => typeof year === 'string' && year.length === 4));
  })();  

  // confirms years only contain digit characters
  (function() {
    let todoYears = todoList.get().map(todo => todo.year);
    console.log(todoYears.every(year => year.match(/[\D]/g) === null)); 
  })();  

  // confirms description is a string
  (function() {
    let todoDescriptions = todoList.get().map(todo => todo.description);
    console.log(todoDescriptions.every(description => typeof description === 'string'));
  })();

  // confirm 'isWithinMonthYear' returns correct values
  (function() {
    console.log(todoList.get(1).isWithinMonthYear('1', '2017'));
    console.log(todoList.get(1).isWithinMonthYear(1, 2017));
    console.log(todoList.get(1).isWithinMonthYear(1, '1995') === false);

    let currentYear = new Date().getFullYear().toString();
    console.log(todoList.get(3).isWithinMonthYear('1', currentYear));
  })();

// todoManager tests
  // confirm 'allTodo's returns copy of all todos from 'todosList'
  console.log(todoManager.allTodos(todoList).length === 7);

  // confirm 'allTodo's objects are copies and originals cannot be mutated
  (function() {
    let todoCopy = todoManager.allTodos(todoList)[0];
    todoCopy.id = 12;
    todoCopy.title = "Don't mutate the original!";
    let originalTodo = todoManager.allTodos(todoList)[0];
    console.log(originalTodo.id !== 12 && originalTodo.title === 'Buy Milk');
  })();

  // confirm 'allTodo's returns null if provided an invalid 'todosList'
  (function() {
    let fakeTodoList = 'fake';
    console.log(todoManager.allTodos(fakeTodoList) === null);
  })();

  // confirm 'completedTodos' only returns completed todos
  (function() {
    todoList.update(1, {completed: true});
    todoList.update(4, {completed: true});
    todoList.update(7, {completed: true});
    let completedTodos = todoManager.completedTodos(todoList);
    console.log(completedTodos.length === 3);
    console.log(completedTodos.every(todo => todo.completed === true))
  })();

  // confirm 'withinMonthYear' returns correct todos
  (function() {
    todoList.update(2, {month: '1'});
    let todo2017 = todoManager.withinMonthYear(todoList, 1, 2017);
    console.log(todo2017.length === 2);
    console.log(todo2017.every(todo => todo.month === '1'));
  })();

  // confirm 'completedWithinMonthYear' returns correct todos
  (function() {
    todoList.update(3, {month: '12', year: '2021', completed: true});
    todoList.update(4, {month: '12', year: '2021', completed: true});
    todoList.update(6, {month: '12', year: '2021', completed: true});
    let completedDec2021 = todoManager.completedWithinMonthYear(todoList, 12, 2021);
    console.log(completedDec2021.length === 3);
    console.log(completedDec2021.every(todo => todo.completed === true && 
                                       todo.month === '12' && todo.year === '2021'));
  })();

  // confirm 'completedWithinMonthYear' returns empty array if no matches
  (function() {
    let noMatches = todoManager.completedWithinMonthYear(todoList, '1', '1900');
    console.log(noMatches.length === 0 && Array.isArray(noMatches));
  })();

// test other list data
  // confirm initializing a todoList with something other than an array of valid properties returns null
  console.log(todoList.init('not an array') === null);
  console.log(todoList.init([ {badProperty: 'undefined'} ]) === null);

  // test todoManager with bad todoList
  console.log(todoManager.allTodos({id: 1, title: 'fakeTodo', completed: false, 
                                    month: '1', year: '2021', description: ''}) === null);

  // test that re-initializing 'todoList' creates a new list with a new counter                                      
  todoList.init([{title: 'new List'}]);
  console.log(todoManager.allTodos(todoList).length === 1);
  console.log(todoManager.allTodos(todoList)[0].id === 1);
