(function() {
  var findObjs = function(element, props, multiple) {
    var match = multiple ? [] : undefined;

    element.some(function(obj) {
      var all_match = true;

      for (var prop in props) {
        if (!(prop in obj) || obj[prop] !== props[prop] ) {
          all_match = false;
        }
      }

      if (all_match) {
        if (multiple) {
          match.push(obj);
        } else {
          match = obj;
          return true;
        }

      }
    });
    return match;
  };


  var _ = function(element) {
    u = {
      first() {
        return element[0];
      },

      last() {
        return element[element.length - 1];
      },

      without(...args) {
        let newArray = [];

        element.forEach(elem => {
          if (args.indexOf(elem) === -1) {
            newArray.push(elem);
          }
        });
        return newArray;
      },

      lastIndexOf(arg) {
        let index = -1;
        element.forEach((elem, idx) => {
          if (elem === arg) {
            index = idx;
          }
        });
        return index;
      },

      sample(size) {
        function randomElement(array) {
          let lastIndex = array.length;
          let randomIndex = Math.floor(Math.random() * lastIndex) - 1;
          return array.splice(randomIndex, 1);
        }
  
        let newArray = element.slice();
        if (size === undefined) {
          return randomElement(newArray)[0];
        } else {
          let sampleArray = [];

          for (let i = 0; i < size; i += 1) {
            sampleArray.push(randomElement(newArray)[0]);
          }
          return sampleArray;
        }
      },

      findWhere(obj) {
        return findObjs(element, obj, false);

        // let keys = Object.keys(obj);
        
        // for (let index = 0; index < element.length; index += 1) {
        //   let currentObj = element[index];
        //   let match = true;

        //   for (let idx = 0; idx < keys.length; idx += 1) {
        //     let key = keys[idx];

        //     if (obj[key] !== currentObj[key]) {
        //       match = false;
        //       break;
        //     }
        //   }

        //   if (match) {
        //     return currentObj;
        //   } else {
        //     continue;
        //   }
        // }
        // return undefined;
      },

      where(obj) {
        return findObjs(element, obj, true);
        // let matches = [];

        // element.forEach(elem => {
        //   let match = true;
        //   for (let prop in obj) {
        //     if (obj[prop] !== elem[prop]) {
        //       match = false;
        //       break;
        //     }
        //   }
        //   if (match) {
        //     matches.push(elem);
        //   }
        // });

        // return matches;
      },

      pluck(key) {
        let returnArray = [];

        element.forEach(obj => {
          if (obj[key]) {
            returnArray.push(obj[key]);
          }
        });
        return returnArray;
      },

      keys() {
        return Object.keys(element);
      },

      values() {
        return Object.values(element);
      },

      pick(...props) {
        let newObj = {};

        props.forEach(prop => {
          if (Object.keys(element).includes(prop)) {
            newObj[prop] = element[prop];
          }
        });
        return newObj;
      },

      omit(...props) {
        let newObj = {};

        Object.keys(element).forEach(oldProp => {
          if (!props.includes(oldProp)) {
            newObj[oldProp] = element[oldProp];
          }
        });
        return newObj;
      },

      has(prop) {
        let properties = Object.keys(element);
        return properties.includes(prop);
      },

    };

    (["isElement", "isArray", "isObject", "isFunction", "isBoolean", "isString", "isNumber"]).forEach(function(method) {
      u[method] = function() { _[method].call(u, element); };
    });

    return u;
  };

  _.isElement = function(obj) {
    return obj && obj.nodeType === 1;
  };

  _.isArray = function(obj) {
    return obj && Array.isArray(obj);
  };

  _.isObject = function(obj) {
    return obj && (typeof obj === "object" || typeof obj === "function");
  };

  _.isFunction = function(obj) {
    return obj && typeof obj === "function";
  };

  (['Boolean', 'String', 'Number']).forEach(function(method) {
    _['is' + method] = function(obj) {
      let primitive = obj.valueOf();
      return typeof primitive === method.toLowerCase();
    }
  });

  // _.isBoolean = function(obj) {
  //   let primitive = obj.valueOf();
  //   return typeof primitive === "boolean";
  // };

  // _.isString = function(obj) {
  //   let primitive = obj.valueOf();
  //   return typeof primitive === "string";
  // };

  // _.isNumber = function(obj) {
  //   let primitive = obj.valueOf();
  //   return typeof primitive === "number"; 
  // };


  _.extend = function(oldObj, ...args) {
    let newObjs = args.reverse();
    newObjs.forEach(obj => {
      for (let prop in obj) {
        oldObj[prop] = obj[prop];
      }
    });
    return oldObj;
  };

  _.range = function(...args) {
        let numberArray = [];
        if (args.length === 1) {
          for (let i = 0; i < args[0]; i += 1) {
            numberArray.push(i);
          } 
        } else {
          for (let i = args[0]; i < args[1]; i += 1) {
            numberArray.push(i);
          }
        }
        return numberArray;
      };

  window._ = _;
})();

