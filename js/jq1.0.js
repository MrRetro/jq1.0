/*!
 * JQ库版本 v1.0.0
 * 个人网站  http://2tro.com/
 * 作者 : Mr.Retro 
 * 邮箱: caijiajia1@126.com
 * QQ号: 395336343
 * 交流群: 584861789
 * Date: 2018/02/10
 */

//自调用结构，沿用1.7版本
(function(w){
	
	var version = '1.0.0';
	
	// 对外暴露的工厂函数
	function jQuery( selector ){
		return new jQuery.fn.init( selector );
	}
	
	// 给原型提供一个简写方式
	jQuery.fn = jQuery.prototype ={
		constructor: jQuery,

        // 获取版本号
        jquery: version,

        // 代表所有实例默认的选择器，也代表实例是一个jQuery类型的对象
        selector: '',

        // 代表所有实例默认的长度
        length: 0,

        // 把实例转换为数组返回
        toArray: function() {
            return [].slice.call( this );
        },

        // 获取指定下标的元素，获取的是原生DOM
        get: function( i ) {
            /*
            * 1、如果传入null或undefined，那么转换为数组返回
            * 2、如果传入的是正数，按照指定的下标获取元素返回
            * 3、如果传入的是负数，按照下标倒着( this.length + 负数 )获取元素返回
            * */

            // null、undeinfed
            if ( i == null ) {
                return this.toArray();
            }

            // 其他
            if ( i >= 0 ) {
                return this[ i ];
            }else {
                return this[ this.length + i ];
            }
        },

        _get: function( i ) {
            return i == null?
                    this.toArray() :
                    ( i >= 0? this[ i ] : this[ this.length + i ] );
        },

        // 遍历实例
        each: function( fn ) {
            return jQuery.each( this, fn );
        },

        // 通过实例得到一个新数组
        map: function( fn ) {
            return jQuery.map( this, fn );
        },

        // 截取实例的部分元素，构成一个新的jQuery实例返回
        slice: function() {
            /*
            * 1、通过数组的slice截取部分元素(slice返回的是数组)，
            * 2、把截取到的元素转换为实例对象返回。
            * */

            // 因为slice的参数会有变化，所以需要是arguments，
            // 我们要把arguments中的每一项传给数组的slice，所以需要借用apply平铺传递过去，
            // 最后把slice返回数组，通过jQuery工厂保证成实例返回。
            var nodes = [].slice.apply( this, arguments );
            return jQuery( nodes );
        },

        _slice: function() {
            // 因为slice的参数会有变化，所以需要是arguments，
            // 我们要把arguments中的每一项传给数组的slice，所以需要借用apply平铺传递过去，
            // 最后把slice返回数组，通过jQuery工厂保证成实例返回。
            return jQuery( [].slice.apply( this, arguments ) );
        },

        // 获取指定下标的元素，获取的是jQuery类型的实例对象。
        eq: function( i ) {
            /*
             * 1、如果传入null或undefined，返回一个新实例，
             * 2、如果传入的是正数，按照指定的下标获取元素，再包装成新实例返回
             * 3、如果传入的是负数，按照下标倒着( this.length + 负数 )获取元素，再包装成新实例返回
             * */

            // null、undefined得到新实例
            if( i == null ) {
                return jQuery();
            }

            if( i >= 0 ) {
                return jQuery( this[ i ] );
            }else {
                return jQuery( this[ this.length + i ] );
            }
        },

        _eq: function( i ) {
            return i == null? jQuery() : jQuery( this.get( i ) );
        },

        // 获取实例中的第一个元素，是jQuery类型的实例对象。
        first: function() {
            return this.eq( 0 );
        },

        // 获取实例中的最后一个元素，是jQuery类型的实例对象。
        last: function() {
            return this.eq( -1 );
        },

        // 原型上的方法供实例调用，
        // 即实例.push，在调用过程中，push内的this就指向了实例，
        // 所以这里不需要通过call和apply改变this指向即可借用数组的方法
        push: [].push,
        sort: [].sort,
        splice: [].splice

	}
	
	// 给jQuery和原型分别添加extend方法
    jQuery.extend = jQuery.fn.extend = function( obj ) {
        for ( var key in obj ) {
            this[ key ] = obj[ key ];
        }
    }

    // 给jQuery添加一些静态方法
    jQuery.extend({
    	
    	// 获取样式,已经处理了兼容性
    	getStyle: function( dom, style ){
    		
    		//优先判断支不支持现代样式获取方式
    		if( window.getComputedStyle){
    			return window.getComputedStyle( dom )[ style ];
    		}else{
    			return dom.currentStyle[ style ];
    		}
    	},
        // 遍历对象或类数组
        each: function( obj, fn ) {
            // 如果是数组或伪数组，按照顺序遍历
            if ( 'length' in obj ) {

                for ( var i = 0, len = obj.length; i < len; i++ ) {

                    // 改变回调执行时内部的this为val，
                    // 通过根据回调的返回值看看要不要中断遍历。
                    if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }

            }else {

                for ( var key in obj ) {

                    // 改变回调执行时内部的this为val，
                    // 通过根据回调的返回值看看要不要中断遍历。
                    if ( fn.call( obj[ key ], key, obj[ key ] ) === false ) {
                        break;
                    }

                }
            }


            return obj;
        },

        // map实现
        map: function( obj, fn ) {

            /*
             * 1、先判断obj是不是数组或者伪数组，
             * 2、如果是，则通过i的方式遍历这个对象
             * 3、如果不是，则通过for in的方式遍历这个对象
             * 4、在遍历的过程中，把每一次遍历到key和val分别传给回调。
             * 5、在给回调传参的时候，需要收集回调的返回值，最后把所有的返回值构成新数组返回。
             * */
            var i, len, key, result = [];

            if( 'length' in obj ) {
                for ( i = 0, len = obj.length; i < len; i++ ) {
                    result.push( fn.call( obj[ i ], obj[ i ], i ) );
                }
            }else {
                for ( key in obj ) {
                    result.push( fn.call( obj[ key ], obj[ key ], key ) );
                }
            }

            return result;
        },

        // 去掉首尾空白字符
        trim: function( str ) {

            // null、undefined、NaN、0、false、''
            if ( !str ) {
                return str;
            }

            // 优先使用原生的
            if ( str.trim ) {
                return str.trim();
            }

            return str.replace( /^\s+|\s+$/g, '');

        },

        // 判断是不是html片段
        isHTML: function( html ) {

            // null、undefined、NaN、0、false、''
            if ( !html ) {
                return false;
            }

            // <.>
            if( html.charAt(0) === '<' &&
                    html.charAt( html.length - 1 ) === '>' &&
                    html.length >= 3 ) {
                return true;
            }

            return false;
        },

        // 判断是不是html片段
        _isHTML: function( html ) {
            return !!html &&
                    html.charAt(0) === '<' &&
                    html.charAt( html.length - 1 ) === '>' &&
                    html.length >= 3;
        },

        // 判断是不是函数
        isFunction: function( fn ) {
            if ( typeof fn === 'function' ) {
                return true;
            }
            return false;
        },

        // 判断是不是函数
        _isFunction: function( fn ) {
            return typeof fn === 'function';
        },

        // 判断是不是window
        isWindow: function( w ) {

            // null、undefined、NaN、0、false、''
            if( !w ) {
                return false;
            }

            if( w.window === w ) {
                return true;
            }

            return false;
        },

        // 判断是不是window
        _isWindow: function( w ) {
            return !!w && w.window === w;
        },

        // 判断是不是对象
        isObject: function( obj ) {

            // 防止typeof对null的误判
            if ( obj === null ) {
                return false;
            }

            // 如果是object或function，那就是对象
            if ( typeof obj === 'object' || typeof obj === 'function' ) {
                return true;
            }

            return false;
        },

        // 判断是不是字符串
        isString: function( str ) {
            if ( typeof str === 'string' ) {
                return true;
            }
            return false;
        },

        // 判断是不是字符串
        _isString: function( str ) {
            return typeof str === 'string';
        },

        // 判断是不是真数组或伪数组
        isLikeArray: function( arr ) {

            // Function、window、!Object
            if ( jQuery.isFunction( arr ) || jQuery.isWindow( arr ) || !jQuery.isObject( arr ) ) {
                return false;
            }

            // 判断是不是真数组
            if ( ({}).toString.call( arr ) === '[object Array]' ) {
                return true;
            }

            // 判断是不是伪数组
            if ( 'length' in arr && ( arr.length === 0 || arr.length - 1 in arr ) ) {
                return true;
            }

            return false;
        },

        ready: function( fn ) {

            // 先统一判断DOMContentloaded有没有触发，
            // 通过document.readyState === 'complete'判断
            // 如果为true，fn可以直接调用。

            // 如果为false，那么判断支不支持addEventListener，
            // 如果支持，绑定DOMContentLoaded事件

            // 如果不支持，使用attchEvent绑定onreadystatechang事件,
            // 注意，需要在里面判断document.readyState === 'complete'才执行fn。
            // 防止fn多次执行。

            // DOM已经构造完毕，fn可以直接执行
            if ( document.readyState === 'complete' ) {
                fn();
            }

            // 如果DOM没有构造完毕，那么判断addEventListener是否兼容
            else if( document.addEventListener ) {
                document.addEventListener( 'DOMContentLoaded', fn );
            }

            // 如果不兼容addEventListener，那么采取attachEvent的方式，
            // 同时事件变为了onreadystatechange，为了防止这个事件多次触发造成的fn多次执行，
            // 所以需要一个包装函数来进行过滤。
            else {
                document.attachEvent( 'onreadystatechange', function() {
                    if( document.readyState === 'complete' ) {
                        fn();
                    }
                } );
            }
        }
    });

	//给原型添加方法
	//插件方法
	// 给原型扩展DOM操作方法，这样jQ实例就可以使用了
	jQuery.fn.extend( {
	
	    // 清空所有元素的内容
	    empty: function() {
	        /*
	         * 实现思路：
	         * 1、遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 2、遍历到的每一个元素清除其内容（ 元素.innerHTML = '' ）
	         * */
	        for ( var i = 0, len = this.length; i < len; i++ ) {
	            this[ i ].innerHTML = '';
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 清空所有元素的内容
	    _empty: function() {
	        /*
	         * 实现思路：
	         * 1、遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 2、遍历到的每一个元素清除其内容（ 元素.innerHTML = '' ）
	         * */
	        this.each( function() {
	            // 这里面的this指向遍历到的每一个元素
	            this.innerHTML = '';
	        } );
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 删除所有的元素
	    remove: function() {
	        /*
	         * 实现思路：
	         * 1、遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 2、遍历到的每一个元素要删除掉
	         * （ 通过parentNode获取该元素的父元素，然后父元素.removeChild( 被删除元素 ) ）
	         * */
	        for( var i = 0, len = this.length; i < len; i++ ) {
	            this[ i ].parentNode.removeChild( this[ i ] );
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 删除所有的元素
	    _remove: function() {
	        /*
	         * 实现思路：
	         * 1、遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 2、遍历到的每一个元素要删除掉
	         * （ 通过parentNode获取该元素的父元素，然后父元素.removeChild( 被删除元素 ) ）
	         * */
	        this.each( function() {
	            // 这里面的this指向遍历到的每一个元素
	            this.parentNode.removeChild( this );
	        });
	
	        // 为了链式编程
	        return this;
	    },
	
	
	    // 设置所有元素的内容，获取第一个元素的内容
	    html: function( html ) {
	        /*
	         * 实现思路：
	         * 1、先通过arguments.length判断有没有传参
	         * 2、没有传，则获取第一个元素，然后返回这个元素的innnerTHML内容
	         * 3、如果传了，则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 4、再设置每一个元素的innerTHML为传入的参数。
	         * */
	
	        // 如果没有传参，那么就直接返回第一个元素的innerHTML
	        if ( arguments.length === 0 ) {
	            return this[ 0 ].innerHTML;
	        }
	
	        // 如果传参了，那么遍历所以元素，分别设置其innerTHML值为传入的html
	        else if( arguments.length >= 1 ) {
	
	            for ( var i = 0, len = this.length; i < len; i++ ) {
	                this[ i ].innerHTML = html;
	            }
	
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 设置所有元素的内容，获取第一个元素的内容
	    _html: function( html ) {
	        /*
	         * 实现思路：
	         * 1、先通过arguments.length判断有没有传参
	         * 2、没有传，则获取第一个元素，然后返回这个元素的innnerTHML内容
	         * 3、如果传了，则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 4、再设置每一个元素的innerTHML为传入的参数。
	         * */
	
	        // 如果没有传参，那么就直接返回第一个元素的innerHTML
	        if ( arguments.length === 0 ) {
	            return this.get(0).innerHTML;
	        }
	
	        // 如果传参了，那么遍历所以元素，分别设置其innerTHML值为传入的html
	        else {
	            this.each( function() {
	                // 这里面的this指向遍历到的每一个元素
	                this.innerHTML = html;
	            });
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 设置所有元素的文本内容，获取所有元素的文本内容
	    text: function( text ) {
	        /*
	         * 实现思路：
	         * 1、先通过arguments.length判断有没有传参
	         * 2、没有传，则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 3、把每一个元素的innerText加在一起返回
	         * 4、则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 5、再设置每一个元素的innerText为传入的参数。
	         * */
	
	        var result = '';
	
	        // 没有传参，获取所有元素的所有文本，然后返回
	        if ( arguments.length === 0 ) {
	
	            for ( var i = 0, len = this.length; i < len; i++ ) {
	                result += this[ i ].innerText;
	            }
	
	            return result;
	        }
	
	        // 如果传参数了，那么设置所有元素的文本
	        else {
	            for ( var i = 0, len = this.length; i < len; i++ ) {
	                this[ i ].innerText = text;
	            }
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 设置所有元素的文本内容，获取所有元素的文本内容
	    _text: function( text ) {
	        /*
	         * 实现思路：
	         * 1、先通过arguments.length判断有没有传参
	         * 2、没有传，则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 3、把每一个元素的innerText加在一起返回
	         * 4、则遍历likeArray（ 可以考虑使用for遍历，也可以考虑使用each遍历 ）
	         * 5、再设置每一个元素的innerText为传入的参数。
	         * */
	
	        var result = '';
	
	        // 没有传参，获取所有元素的所有文本，然后返回
	        if ( arguments.length === 0 ) {
	
	            this.each( function() {
	                result += this.innerText;
	            });
	
	            return result;
	        }
	
	        // 如果传参数了，那么设置所有元素的文本
	        else {
	            this.each( function() {
	                this.innerText = text;
	            });
	        }
	
	        // 为了链式编程
	        return this;
	    },
	
	    // 把所有的元素添加到指定的元素中
	    appendTo: function( selector ) {
	        /*
	        * 实现思路：
	        * 1、定义一个数组，用来存储将来所有被添加的元素
	        * 2、使用jQuery包装一下selector，把不同的参数统一为jQ实例。
	        * 3、在外层遍历所有的元素(this)
	        * 4、在内层遍历所有的目标(包装后的jQ实例)
	        * 5、在内层判断，如果是第一次，则把外面遍历的元素本体添加到内层遍历的元素，
	        * 如果不是第一次，则把外面遍历的元素clone版本添加到内层遍历的元素。
	        * 6、最后把存储被添加元素的数组使用jQ包装一下，然后返回。
	        * */
	
	        // 存储被添加的元素
	        var result = [], tempNode = null;
	
	        // 无论传入的是DOM还是jQ对象还是选择器，
	        // 统一包装成新的JQ实例，这样就可以统一处理了
	        var $selector = $( selector );
	
	        // 遍历每一项元素( this )
	        for ( var i = 0, len = this.length; i < len; i++ ) {
	
	            // 遍历每一个目的地( $selector )
	            for ( var j = 0, jLen = $selector.length; j < jLen; j++ ) {
	
	                // 如果第一次，给遍历到的目的地添加本体
	                if ( j === 0 ) {
	
	                    // 存储被添加的元素
	                    tempNode = this[ i ];
	
	                    // 把元素添加到目的地
	                    $selector[ j ].appendChild(  this[ i ] );
	
	                    // append啥，就把啥存储到result数组中，最后包装成JQ对象返回
	                    // 把元素存储到result数组中
	                    result.push(  this[ i ] );
	
	                }else {
	
	                    // 存储被添加的元素
	                    tempNode = this[ i ].cloneNode( true );
	
	                    // 把元素添加到目的地
	                    $selector[ j ].appendChild( tempNode );
	
	                    // append啥，就把啥存储到result数组中，最后包装成JQ对象返回
	                    // 把元素存储到result数组中
	                    result.push( tempNode );
	                }
	            }
	
	        }
	
	        // 把所有被添加的元素保证成新实例返回，
	        // 这样可以对所有被添加的元素进行链式编程。
	        return jQuery( result );
	    },
	
	    // 把所有的元素添加到指定的元素中
	    _appendTo: function( selector ) {
	        /*
	         * 实现思路：
	         * 1、定义一个数组，用来存储将来所有被添加的元素
	         * 2、使用jQuery包装一下selector，把不同的参数统一为jQ实例。
	         * 3、在外层遍历所有的元素(this)
	         * 4、在内层遍历所有的目标(包装后的jQ实例)
	         * 5、在内层判断，如果是第一次，则把外面遍历的元素本体添加到内层遍历的元素，
	         * 如果不是第一次，则把外面遍历的元素clone版本添加到内层遍历的元素。
	         * 6、最后把存储被添加元素的数组使用jQ包装一下，然后返回。
	         * */
	
	        // 存储被添加的元素
	        var result = [], tempNode = null;
	
	        // 无论传入的是DOM还是jQ对象还是选择器，
	        // 统一包装成新的JQ实例，这样就可以统一处理了
	        var $selector = $( selector );
	
	        // 遍历每一项元素( this )
	        this.each( function() {
	
	            // 这里的this指向每一个被添加的元素
	            var self = this;
	
	            // 遍历每一个目的地( $selector )
	            $selector.each( function( i ) {
	
	                // 如果第一次，给遍历到的目的地添加本体
	                // 先把被添加的元素得到
	                tempNode = i === 0? self: self.cloneNode( true );
	
	                // 这里的this指向每一个目的地，给目的地添加外面遍历的元素
	                this.appendChild( tempNode );
	                result.push( tempNode );
	            });
	        });
	
	        // 把所有被添加的元素保证成新实例返回，
	        // 这样可以对所有被添加的元素进行链式编程。
	        return jQuery( result );
	    },
	    
	    // 把所有的元素添加到指定的元素的最前面
	    prependTo: function( selector ){
	    	/*
	    	 * 实现思路:
	    	 * 1、定义一个数组，用来存储将来所有被添加的元素
	    	 * 2、使用jQuery包装一下selector, 把不同的参数统一为jQ实例
	    	 * 3、在外层遍历所有的元素(this)
	    	 * 4、在内层遍历所有的目标(包装后的JQ实例)
	    	 * 5、在内测判断,如果是第一次，则把外面遍历的元素本体添加到内层遍历元素的最前面,
	    	 * 如果不是第一次,则把外面遍历的元素clone版本添加到内层遍历元素的最前面。
	    	 * 6、最后把存储被添加的元素的数组使用jQ包装一下，然后返回
	    	 **/
	    	var result = [], tempNode;
	    	
	    	// 无论传入的是DOM还是jQ对象还是选择器
	    	// 统一包装成新的jQ实例, 这样就可以统一处理了
	    	var $selector = jQuery( selector );
	    	
	    	for( var i=0, len = this.length; i < len; i++){
	    		
	    		// $selector
	    		for( var j=0, jLen = $selector.length; j < jLen; j++){
	    			
	    			// 先得到被添加的元素
	    			tempNode = j === 0 ? this[ i ] : this[ i ].cloneNode( true );
	    			
	    			// 添加到指定元素的最前面
	    			$selector[ j ].insertBefore( tempNode, $selector[ j ].firstChild );
	    			
	    			// 把被添加的元素存储起来
	    			result.push( tempNode );
	    		}
	    		
	    	}
	    	
	    	// 把所有被添加的元素保证成新实例返回，
	        // 这样可以对所有被添加的元素进行链式编程。
	    	return jQuery( result );
	    	
	    },
	    
	    // 把所有的元素添加到指定的元素的最前面
	    _prependTo: function( selector ){
	    	/*
	    	 * 实现思路:
	    	 * 1、定义一个数组，用来存储将来所有被添加的元素
	    	 * 2、使用jQuery包装一下selector, 把不同的参数统一为jQ实例
	    	 * 3、在外层遍历所有的元素(this)
	    	 * 4、在内层遍历所有的目标(包装后的JQ实例)
	    	 * 5、在内测判断,如果是第一次，则把外面遍历的元素本体添加到内层遍历元素的最前面,
	    	 * 如果不是第一次,则把外面遍历的元素clone版本添加到内层遍历元素的最前面。
	    	 * 6、最后把存储被添加的元素的数组使用jQ包装一下，然后返回
	    	 **/
	    	var result = [], tempNode;
	    	
	    	// 无论传入的是DOM还是jQ对象还是选择器
	    	// 统一包装成新的jQ实例, 这样就可以统一处理了
	    	var $selector = jQuery( selector );
	    	
	    	this.each(function(){
	    		// 这里this指每一个被添加的元素
	    		var self = this;
	    		
	    		$selector.each(function( i ){
	    			// 这里this指每一个被添加元素的目的地
	    			console.log(i)
	    			// 先得到被添加的元素
	    			tempNode = i === 0? self: self.cloneNode( true );
	    			
	    			// 添加到指定元素的最前面
	    			this.insertBefore( tempNode, this.firstChild );
	    			
	    			// 把被添加的元素存储起来
	    			result.push( tempNode );
	    			
	    		});
	    		
	    	});
	    	
	    	// 把所有被添加的元素保证成新实例返回，
	        // 这样可以对所有被添加的元素进行链式编程。
	    	return jQuery( result );
	    },
	    
	    // 给所有元素添加html内容,或者其他元素
	    append: function( context ){
	    	
	    	/*
	    	 * 实现思路:
	    	 * 1、判断context是不是字符串
	    	 * 2、如果是,则把这个字符串累加给所有元素
	    	 * 3、如果不是,则先把context包装成jQ对象统一处理
	    	 * 4、外层遍历
	    	 * 5、内层遍历  4、5、6完全可以考虑复用appendTo
	    	 * 6、添加元素
	    	 * 7、返回this
	    	 **/
	    	
	    	var $context = $( context );
	    	
	    	// 如果是字符串,则累加给所有元素
	    	if( jQuery.isString( context ) ){
	    		for( var i = 0, len = this.length; i < len; i++ ){
	    			this[ i ].innerHTML += context;
	    		}
	    	}
	    	// 如果不是字符串,则把$context的每一项添加this的每一项中
	    	else{
	    		$context.appendTo( this );
	    	}
	    	
	    	return this;
	    	
	    },
	    
	    // 给所有元素添加html内容,或者其他元素
	    _append: function( context ){
	    	
	    	/*
	    	 * 实现思路:
	    	 * 1、判断context是不是字符串
	    	 * 2、如果是,则把这个字符串累加给所有元素
	    	 * 3、如果不是,则先把context包装成jQ对象统一处理
	    	 * 4、外层遍历
	    	 * 5、内层遍历  4、5、6完全可以考虑复用appendTo
	    	 * 6、添加元素
	    	 * 7、返回this
	    	 **/
	    	
	    	var $context = $( context );
	    	
	    	// 如果是字符串,则累加给所有元素
	    	if( jQuery.isString( context ) ){
	    		this.each(function(){
	    			
	    			// 把得到的每一个元素进行innerHTML累加
	    			this.innerHTML += context;
	    		});
	    	}
	    	// 如果不是字符串,则把$context的每一项添加this的每一项中
	    	else{
	    		$context.appendTo( this );
	    	}
	    	
	    	return this;
	    	
	    },
	    
	    // 给所有元素内容前添加html内容,或者其他元素
	    prepend: function( context ){
	    	var $context = $( context );
	    	
	    	// 如果是字符串,则累加给所有元素
	    	if( jQuery.isString( context ) ){
	    		this.each(function(){
	    			
	    			// 把得到的每一个元素进行innerHTML累加
	    			this.innerHTML = context + this.innerHTML;
	    		});
	    	}
	    	// 如果不是字符串,则把$context的每一项添加this的每一项最前面
	    	else{
	    		$context.prependTo( this );
	    	}
	    	
	    	return this;
	    },
	    // 给所有元素内容前添加html内容,或者其他元素
	    _prepend: function( context ){
	    	var $context = $( context );
	    	
	    	// 如果是字符串,则累加给所有元素
	    	if( jQuery.isString( context ) ){
	    		this.each(function(){
	    			
	    			// 把得到的每一个元素进行innerHTML累加
	    			this.innerHTML = context + this.innerHTML;
	    		});
	    	}
	    	// 如果不是字符串,则把$context的每一项添加this的每一项最前面
	    	else{
	    		$context.prependTo( this );
	    	}
	    	
	    	return this;
	    },
	    //给所有元素添加新的class
	    addClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次判断每一个元素有没有要添加的className
	    	 * 3、有则忽略,没有则添加( className += ' ' + classNames )
	    	 * 4、考虑trim一下
	    	 * 5、链式编程返回this
	    	 **/
	    	
	    	for( var i = 0, len = this.length; i < len; i++ ){
	    		
	    		if((' ' + this[ i ].className + ' ').indexOf(' ' + className + ' ') == -1){
	    			this[ i ].className+=' '+ className;
	    		}
	    		
	    	}
	    	
	    	//链式编程返回this
	    	return this;
	    	
	    },
	    //给所有元素添加新的class
	    _addClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次判断每一个元素有没有要添加的className
	    	 * 3、有则忽略,没有则添加( className += ' ' + classNames )
	    	 * 4、考虑trim一下
	    	 * 5、链式编程返回this
	    	 **/
	    	
	    	this.each(function(){
	    		if((' ' + this.className + ' ').indexOf(' ' + className + ' ') == -1){
	    			this.className+=' '+ className;
	    		}
	    	})
	    	
	    	//链式编程返回this
	    	return this;
	    	
	    },
	    //给所有元素添加新的class
	    __addClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次判断每一个元素有没有要添加的className
	    	 * 3、有则忽略,没有则添加( className += ' ' + classNames )
	    	 * 4、考虑trim一下
	    	 * 5、链式编程返回this
	    	 **/
	    	
	    	this.each(function(){
	    		if( !jQuery( this ).hasClass( className ) ){
	    			this.className+=' '+ className;
	    		}
	    	})
	    	
	    	//链式编程返回this
	    	return this;
	    	
	    },
	    //删除所有元素指定的class
	    removeClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、没有参数,遍历所有的元素, 设置他们的className为空
	    	 * 2、有参数,遍历所有的元素,删除指定的className(元素.className.replace())
	    	 * 把指定的className替换为空格,最后整体trim一下
	    	 * 3、链式编程返回this
	    	 **/
	    	
	    	if( arguments.length === 0 ){
	    		this.each( function(){
	    			this.className = '';
	    		});
	    	}else{
	    		this.each( function(){
	    			this.className = (' ' + this.className + ' ').replace(' ' + className +' ', ' ');
	    		});
	    	}
	    	
	    },
	    //判断所有元素有没有指定的class
	    hasClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次获取每一个元素的className,为了方便判断,首尾加空格
	    	 * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className(这个class类名)
	    	 * 4、如果有一个元素的判断结果不为-1,就返回true
	    	 * 5、否则返回false。
	    	 **/
	    	
	    	for( var i = 0, len = this.length; i < len; i++ ){
	    		
	    		if( (' ' + this[ i ].className + ' ').indexOf(' ' + className + ' ') > -1){
	    			return true;
	    		}
	    	}
	    	
	    	//如果所有的元素都没有 返回false
	    	return false;
	    	
	    },
	    //判断所有元素有没有指定的class
	    _hasClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次获取每一个元素的className,为了方便判断,首尾加空格
	    	 * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className(这个class类名)
	    	 * 4、如果有一个元素的判断结果不为-1,就返回true
	    	 * 5、否则返回false。
	    	 **/
	    	
	    	//默认为所有的元素都没有指定的className
	    	var has = false;
	    	
	    	this.each( function(){
				
				// 只要有一个元素存在指定的className,那么就修改has的变量值为true
				if( (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1 ){
					has = true;
				}
				
	    	});
	    	
	    	//返回has
	    	return has;
	    	
	    },
	    //判断所有元素有没有指定的class
	    __hasClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、依次获取每一个元素的className,为了方便判断,首尾加空格
	    	 * 3、利用处理过的className字符串的indexOf方法判断有没有指定的className(这个class类名)
	    	 * 4、如果有一个元素的判断结果不为-1,就返回true
	    	 * 5、否则返回false。
	    	 **/
	    	
	    	//默认为所有的元素都没有指定的className
	    	var has = false;
	    	
	    	this.each( function(){
				
				// 只要有一个元素存在指定的className,那么就修改has的变量值为true
				if( (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1 ){
					has = true;
					
					// 中断遍历
					return false;
				}
				
	    	});
	    	
	    	//返回has
	    	return has;
	    	
	    },
	    //有则删除,没有则添加
	    toggleClass: function( className ){
	    	/*
	    	 * 实现思路:
	    	 * 1、遍历所有的元素
	    	 * 2、判断每一个元素有则删除,没有添加
	    	 **/
	    	
	    	this.each( function(){
	    		// 这里的this是遍历到每一个原生DOM
	    		// 先包装成JQ对象,就可以复用之前写好的方法了
	    		var $this = jQuery( this );
				
				// 有则删除,没有则添加
				if( $this.hasClass( className ) ){
					$this.removeClass( className );
				}else{
					$this.addClass( className );
				}
				
	    	})
	    },
	    //设置或者获取元素属性节点值
	    attr: function( attr, val ){
	    	/*
	    	 * 实现思路:
	    	 * 1、判断attr是不是字符串或者对象,不是直接return this
	    	 * 2、如果是字符串,那么继续判断arguments的length
	    	 * 3、length为1,则获取第一个元素指定的属性节点值返回
	    	 * 4、length>=2,遍历所有元素,分别给他们设置新的属性节点值( setAttribute )
	    	 * 5、如果不是字符串(是对象),那么遍历这个对象,得到所有的属性节点值,
	    	 * 然后遍历所有的元素,把所有的属性节点分别添加到这些元素中
	    	 * 6、return this
	    	 **/
	    	
	    	// 如果不是字符串也不是对象
	    	if( !jQuery.isString( attr ) && !jQuery.isObject( attr ) ){
	    		return this;
	    	}
	    	// 如果是字符串
	    	if( jQuery.isString( attr ) ){
	    		
	    		// length为1,则获取第一个元素指定的属性节点值返回
	    		if( arguments.length === 1 ){
	    			return this.get( 0 ).getAttribute( attr );
	    		}
	    		
	    		// 如果length为多个(2及2个以上)
	    		// 则遍历所有的元素,分别设置属性节点值
	    		else{
	    			for( var i = 0, len = this.length; i < len; i++){
	    				this[ i ].setAttribute( attr, val );
	    			}
	    		}
	    		
	    	}
	    	
	    	// 如果是对象
	    	// 遍历这个对象,和所有的元素, 分别添加遍历到的属性接节点值
	    	else{
	    		
	    		for( var key in attr ){
	    			for( var i = 0, len = this.length; i < len; i++ ){
	    				this[i].setAttribute( key, attr[key] )
	    			}
	    		}
	    		
	    	}
	    	return this;
	    	
	    },
	    //设置或者获取元素属性节点值
	    _attr: function( attr, val ){
	    	/*
	    	 * 实现思路:
	    	 * 1、判断arguments.length
	    	 * 2、如果为1
	    	 * 3、继续判断attr是不是字符串,如果是获取第一个元素指定的属性节点值返回
	    	 * 4、如果不是继续判断是不是对象,如果是遍历这个对象,得到所有属性节点值,
	    	 * 然后遍历所有的元素,把所有的属性节点分别添加到这些元素中
	    	 * 5、如果为多个(2及以上),遍历所有元素分别设置属性节点值
	    	 * 6、return this
	    	 **/
	    	
	    	// 把实例使用别称存储一下，为了在别的地方使用
	    	var self = this;
	    	
	    	if( arguments.length === 1 ){
	    		
	    		// 如果是字符串,获取第一个元素指定的属性节点值返回
	    		if( jQuery.isString( attr ) ){
	    			return this[ 0 ].getAttribute( attr );
	    		}
	    		
	    		// 如果是对象,把对象中所有的属性节点添加到所有的元素中
	    		else if( jQuery.isObject( attr) ){
	    			
	    			// 使用jQ静态each方法遍历attr对象
	    			jQuery.each( attr, function( key, val ){
	    				// 这里便利到的val不是对象类型, 是基本数据类型
	    				// 我们要使用的就是基本数据类型, 而this是基本数据类型的包装类型(),
	    				// 所以这里不能使用this。
	    				
	    				//遍历所有的元素
	    				self.each(function(){
	    					
	    					// 给遍历到的每一个元素分别设置外面遍历到的属性节点
	    					this.setAttribute( key, val );
	    					
	    				});
	    				
	    			});
	    			
	    		}
	    	//如果参数个数为多个
	    	}else if( arguments.length >= 2){
	    		
	    		// 遍历所有元素分别设置对应的属性节点值
	    		this.each(function(){
	    			this.setAttribute( attr, val )
	    		});
	    		
	    	}
	    	
	    	// 如果不是字符串也不是对象
	    	if( !jQuery.isString( attr ) && !jQuery.isObject( attr ) ){
	    		return this;
	    	}
	    	
	    	return this;
	    	
	    },
	    //设置或者获取元素的属性值
	    prop: function( attr, val ){
	    	/*
	    	 * 实现思路:
	    	 * 1、判断attr是不是字符串或者对象,不是直接return this
	    	 * 2、如果是字符串,那么继续判断arguments的length
	    	 * 3、length为1,则获取第一个元素指定的属性节点值返回
	    	 * 4、length>=2,遍历所有元素,分别给他们设置新的属性节点值( setAttribute )
	    	 * 5、如果不是字符串(是对象),那么遍历这个对象,得到所有的属性节点值,
	    	 * 然后遍历所有的元素,把所有的属性节点分别添加到这些元素中
	    	 * 6、return this
	    	 **/
	    	
	    	// 如果不是字符串也不是对象
	    	if( !jQuery.isString( attr ) && !jQuery.isObject( attr ) ){
	    		return this;
	    	}
	    	
	    	// 如果是字符串
	    	if( jQuery.isString( attr ) ){
	    		
	    		// 如果只有一个参数为字符串,那么返回第一个元素指定的属性值
	    		if( arguments.length === 1 ){
	    			return this[0][attr];
	    		}
	    		
	    		// 如果有多个参数, 那么给所有元素设置指定的属性值
	    		else{
	    			for( var i = 0, len = this.length; i < len; i++){
	    				this[ i ][ attr ] = val;
	    			}
	    		}
	    		
	    	}
	    	
	    	// 如果是对象
	    	// 遍历这个对象,和所有的元素, 分别添加遍历到的属性值
	    	else{
	    		
	    		for( var key in attr ){
	    			for( var i = 0, len = this.length; i < len; i++ ){
	    				
	    				// 给每一个元素设置属性
	    				this[ i ][ key ] = attr[ key ];
	    			}
	    		}
	    		
	    	}
	    	return this;
	    	
	    },
	    //设置或者获取属性值
	    _prop: function( attr, val ){
	    	/*
	    	 * 实现思路:
	    	 * 1、判断arguments.length为1
	    	 * 2、继续判断attr是不是字符串,如果是获取第一个元素指定的属性
	    	 * 3、如果不是继续判断是不是对象,如果是遍历这个对象,得到所有属性,
	    	 * 4、如果为多个(2及以上),遍历所有元素分别设置指定属性
	    	 * 5、链式编程return this
	    	 **/
	    	
	    	// 把实例使用别称存储一下，为了在别的地方使用
	    	var self = this;
	    	
	    	if( arguments.length === 1 ){
	    		
	    		// 如果是字符串,获取第一个元素指定的属性节点值返回
	    		if( jQuery.isString( attr ) ){
	    			return this[ 0 ][ attr ];
	    		}
	    		
	    		// 如果是对象,把对象中所有的属性添加到所有的元素中
	    		else if( jQuery.isObject( attr) ){
	    			
	    			// 使用jQ静态each方法遍历attr对象
	    			jQuery.each( attr, function( key, val ){
	    				// 这里便利到的val不是对象类型, 是基本数据类型
	    				// 我们要使用的就是基本数据类型, 而this是基本数据类型的包装类型(),
	    				// 所以这里不能使用this。
	    				
	    				//遍历所有的元素
	    				self.each(function(){
	    					
	    					// 给遍历到的每一个元素分别设置外面遍历到的属性
	    					this[ key ] = val;
	    					
	    				});
	    				
	    			});
	    			
	    		}
	    	//如果参数个数为多个
	    	}else if( arguments.length >= 2){
	    		
	    		// 遍历所有元素分别设置对应的属性值
	    		this.each(function(){
	    			this[ attr ] = val;
	    		});
	    		
	    	}
	    	
	    	return this;
	    	
	    },
	    //获取或者设置元素的value的属性值
	    val: function( value ){
	    	
	    	/*
	    	 * 实现思路:
	    	 * 1、如果arguments.length === 0,则直接返回第一个元素的value属性值
	    	 * 2、否则,遍历所有的元素,分别设置对应的value属性值
	    	 * 3、链式编程返回this
	    	 **/
	    	
	    	// 没有传参,返回第一个元素的value属性值
	    	if( arguments.length === 0 ){
	    		return this[ 0 ].value;
	    	}
	    	
	    	// 否则给所有元素分别设置value值
	    	else {
	    		for( var i = 0, len = this.length; i < len; i++){
	    			this[ i ].value = value;
	    		}
	    	}
	    	
	    	//链式编程
	    	return this;
	    	
	    },
	    //获取或者设置元素的value的属性值
	    _val: function( value ){
	    	
	    	/*
	    	 * 实现思路:
	    	 * 1、如果arguments.length === 0,则直接返回第一个元素的value属性值
	    	 * 2、否则,遍历所有的元素,分别设置对应的value属性值
	    	 * 3、链式编程返回this
	    	 **/
	    	
	    	// 没有传参,返回第一个元素的value属性值
	    	if( arguments.length === 0 ){
	    		return this[ 0 ].value;
	    	}
	    	
	    	// 否则给所有元素分别设置value值
	    	else {
	    		this.each( function(){
	    			this.value = value;
	    		});
	    	}
	    	
	    	//链式编程
	    	return this;
	    	
	    },
	    //获取或者设置元素的value的属性值
	    __val: function( value ){
	    	
	    	// 没有传参,借用prop获取第一个元素的value属性值
	    	if( arguments.length === 0 ){
	    		return this.prop( 'value' );
	    	}
	    	// 传参了,借用prop给所有元素设置新的value属性值
	    	else {
	    		return this.prop( 'value', value );
	    	}
	    	
	    },
	    // 设置或者获取样式
	    css: function( styleName, style ){
	    	
	    	/*
	    	 * 实现思路:
	    	 * 1、如果arguments.length为1
	    	 * 2、那么判断styleName是不是字符串, 是则获取第一个元素指定的样式
	    	 * 3、判断styleName是不是对象。是则遍历这个对象得到所有的样式分别设置给所有元素
	    	 * 4、如果arguments.length>=2,遍历所有元素分别设置指定的样式
	    	 * 5、链式变成返回this
	    	 **/
	    	
	    	if( arguments.length === 1 ){
	    		
	    		if( jQuery.isString( styleName ) ){
	    			return jQuery.getStyle( this[ 0 ], styleName );
	    		}
	    		
	    		else if( jQuery.isObject( styleName ) ){
	    			
	    			// 遍历styleName得到所有的样式
	    			for( var key in styleName ){
	    				
	    				// 遍历得到所有元素
	    				for( var i = 0, len = this.length; i < len; i++ ){
	    					
	    					// 给素有的元素设置遍历到所有样式
	    					this[ i ][ 'style' ][ key ] = styleName[ key ];
	    					
	    				}
	    				
	    			}
	    		}
	    		
	    	}
	    	
	    	else if( arguments.length >= 2 ){
	    		
	    		//给所有元素设置指定样式
	    		for( var i = 0, len = this.length; i <len; i++ ){
	    			this[ i ][ 'style' ][ styleName ] = style;
	    		}
	    		
	    	}
	    	
	    	return this;
	    	
	    }
	} );

    // 这是真正的构造函数，同时把构造函数放在了原型中
    var init = jQuery.fn.init = function( selector ) {

        // null、undefined、NaN、0、false、''
        if ( !selector ) {
            return this;
        }

        // function
        if ( jQuery.isFunction( selector ) ) {

            // 打包给ready静态方法处理
            jQuery.ready( selector );
        }

        // string ==> ( html || selector )
        else if( jQuery.isString( selector ) ) {

            // 为了用户友好体验，先去掉首尾空白字符
            selector = jQuery.trim( selector );

            // html
            if( jQuery.isHTML( selector ) ) {

                // 利用一个临时的div来创建DOM，
                // 然后把创建好的DOM依次push给实例。
                var tempDiv = document.createElement( 'div' );
                tempDiv.innerHTML = selector;
                [].push.apply( this, tempDiv.childNodes );

            }

            // selector
            else {

                try {
                    [].push.apply( this, document.querySelectorAll( selector ) );
                }catch(e) {
                    // 如果报错了，那么手动补一个length属性，代表没有获取到任何元素
                    this.length = 0;
                }
            }
        }

        // array || likeArray
        else if( jQuery.isLikeArray( selector ) ) {
            [].push.apply( this, [].slice.call( selector ) );
        }

        // 其它
        else {
            this[0] = selector;
            this.length = 1;
        }
    };
    
	// 替换构造函数的原型 为 jQuery工厂的原型
	// 为了实现插件，让外界可以透过jQuery.fn访问到init原型
	init.prototype = jQuery.fn;
	
	// 暴露工厂和工厂的简称
	w.jQuery = w.$ =jQuery;
	
}( window ));

