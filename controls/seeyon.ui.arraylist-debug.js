/**
 * @author macj
 */
/**
 * StringStringBuffer对象
 */
function StringBuffer(){
	this._strings_ = new Array();
}
StringBuffer.prototype.append = function(str){
	if(str){
		if(str instanceof Array){
			this._strings_ = this._strings_.concat(str);
		}
		else{
			this._strings_[this._strings_.length] = str;
		}
	}
	
	return this;
}
StringBuffer.prototype.reset = function(newStr){
	this.clear();
	this.append(newStr);
}
StringBuffer.prototype.clear = function(){
	this._strings_ = new Array();
}
StringBuffer.prototype.isBlank = function(){
	return this._strings_.length == 0;
}

StringBuffer.prototype.toString = function(sp){
	sp = sp == null ? "" : sp;
	if (this._strings_.length == 0)
		return "";
	return this._strings_.join(sp);
}
String.prototype.getBytesLength = function(){
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
};

String.prototype.getLimitLength = function(maxlengh, symbol){
    if (!maxlengh || maxlengh < 0) {
        return this;
    }
    var len = this.getBytesLength();
    
    if (len <= maxlengh) {
        return this;
    }
    
    symbol = symbol == null ? ".." : symbol;
    maxlengh = maxlengh - symbol.length;
    
    var a = 0;
    var temp = '';
    
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255) 
            a += 2;
        else 
            a++;
        
        temp += this.charAt(i);
        
        if (a >= maxlengh) {
            return temp + symbol;
        }
    }
    
    return this;
};

String.prototype.escapeHTML = function(isEscapeSpace,isEscapeBr){
    try {
        return escapeStringToHTML(this, isEscapeSpace,isEscapeBr);
    } 
    catch (e) {
    }
    
    return this;
};

String.prototype.escapeJavascript = function(){
    return escapeStringToJavascript(this);
};

String.prototype.escapeSpace = function(){
    return this.replace(/ /g, "&nbsp;");
};

String.prototype.escapeSameWidthSpace = function(){
    return this.replace(/ /g, "&nbsp;&nbsp;");
};

String.prototype.escapeXML = function(){
    return this.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;");
};
String.prototype.escapeQuot = function(){
    return this.replace(/\'/g, "&#039;").replace(/"/g, "&#034;");
};
String.prototype.startsWith = function(prefix){
    return this.indexOf(prefix) == 0;
};
String.prototype.endsWith = function(subfix){
    var pos = this.indexOf(subfix);
    return pos > -1 && pos == this.length - subfix.length;
};

/**
 * 去掉空格
 */
String.prototype.trim = function(){
    var chs = this.toCharArray();
    
    var st = 0;
    var off = chs.length;
    
    for (var i = 0; i < chs.length; i++) {
        var c = chs[i];
        if (c == ' ') {
            st++;
        }
        else {
            break;
        }
    }
    
    if (st == this.length) {
        return "";
    }
    
    for (var i = chs.length; i > 0; i--) {
        var c = chs[i - 1];
        if (c == ' ') {
            off--;
        }
        else {
            break;
        }
    }
    
    return this.substring(st, off);
};

/**
 * 将字符串转成数组
 */
String.prototype.toCharArray = function(){
    var array = [];
    
    for (var i = 0; i < this.length; i++) {
        array[i] = this.charAt(i);
    }
    
    return array;
};
/**
 * ArrayList like java.util.ArrayList
 */
function ArrayList(){
    this.instance = new Array();
}

ArrayList.prototype.size = function(){
    return this.instance.length;
}
/**
 * 在末尾追加一个
 */
ArrayList.prototype.add = function(o){
    this.instance[this.instance.length] = o;
}
/**
 * 当list中不存在该对象时才添加
 */
ArrayList.prototype.addSingle = function(o){
    if (!this.contains(o)) {
        this.instance[this.instance.length] = o;
    }
}
/**
 * 在指定位置增加元素
 * @param posation 位置， 从0开始
 * @param o 要增加的元素
 */
ArrayList.prototype.addAt = function(position, o){
    if (position >= this.size() || position < 0 || this.isEmpty()) {
        this.add(o);
        return;
    }
    
    this.instance.splice(position, 0, o);
}

/**
 * Appends all of the elements in the specified Collection to the end of
 * this list, in the order that they are returned by the
 * specified Collection's Iterator.  The behavior of this operation is
 * undefined if the specified Collection is modified while the operation
 * is in progress.  (This implies that the behavior of this call is
 * undefined if the specified Collection is this list, and this
 * list is nonempty.)
 */
ArrayList.prototype.addAll = function(array){
    if (!array || array.length < 1) {
        return;
    }
    
    this.instance = this.instance.concat(array);
}

/**
 * 追加一个List在队尾
 */
ArrayList.prototype.addList = function(list){
    if (list && list instanceof ArrayList && !list.isEmpty()) {
        this.instance = this.instance.concat(list.instance);
    }
}

/**
 * @return the element at the specified position in this list.
 */
ArrayList.prototype.get = function(index){
    if (this.isEmpty()) {
        return null;
    }
    
    if (index > this.size()) {
        return null;
    }
    
    return this.instance[index];
}

/**
 * 最后一个
 */
ArrayList.prototype.getLast = function(){
    if (this.size() < 1) {
        return null;
    }
    
    return this.instance[this.size() - 1];
}

/**
 * Replace the element at the specified position in the list with the specified element
 * @param index int index of element to replace
 * @param obj Object element to be stored at the specified posotion
 * @return Object the element previously at the specified posotion
 * @throws IndexOutOfBoundException if index out of range
 */
ArrayList.prototype.set = function(index, obj){
    if (index >= this.size()) {
        throw "IndexOutOfBoundException : Index " + index + ", Size " + this.size();
    }
    
    var oldValue = this.instance[index];
    this.instance[index] = obj;
    
    return oldValue;
}

/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 */
ArrayList.prototype.removeElementAt = function(index){
    if (index > this.size() || index < 0) {
        return;
    }
    
    this.instance.splice(index, 1);
}
/**
 * Removes the element in this list.
 */
ArrayList.prototype.remove = function(o){
    var index = this.indexOf(o);
    this.removeElementAt(index);
}
/**
 * @return <tt>true</tt> if this list contains the specified element.
 */
ArrayList.prototype.contains = function(o, comparatorProperies){
    return this.indexOf(o, comparatorProperies) > -1;
}
/**
 * Searches for the first occurence of the given argument, testing
 * for equality using the <tt>==</tt> method.
 */
ArrayList.prototype.indexOf = function(o, comparatorProperies){
    for (var i = 0; i < this.size(); i++) {
        var s = this.instance[i];
        if (s == o) {
            return i;
        }
        else 
            if (comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]) {
                return i;
            }
    }
    
    return -1;
}
/**
 * Returns the index of the last occurrence of the specified object in this list.
 * @return the index of the last occurrence of the specified object in this list;
 *         returns -1 if the object is not found.
 */
ArrayList.prototype.lastIndexOf = function(o, comparatorProperies){
    for (var i = this.size() - 1; i >= 0; i--) {
        var s = this.instance[i];
        if (s == o) {
            return i;
        }
        else 
            if (comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]) {
                return i;
            }
    }
    
    return -1;
}

/**
 * Returns a view of the portion of this list between
 * fromIndex, inclusive, and toIndex, exclusive.
 * @return a view of the specified range within this list.
 */
ArrayList.prototype.subList = function(fromIndex, toIndex){
    if (fromIndex < 0) {
        fromIndex = 0;
    }
    
    if (toIndex > this.size()) {
        toIndex = this.size();
    }
    
    var tempArray = this.instance.slice(fromIndex, toIndex);
    
    var temp = new ArrayList();
    temp.addAll(tempArray);
    
    return temp;
}
/**
 * Returns an array containing all of the elements in this list in the correct order;
 *
 * @return Array
 */
ArrayList.prototype.toArray = function(){
    return this.instance;
}

/**
 * Tests if this list has no elements.
 *
 * @return <tt>true</tt> if this list has no elements;
 */
ArrayList.prototype.isEmpty = function(){
    return this.size() == 0;
}
/**
 * Removes all of the elements from this list.  The list will
 * be empty after this call returns.
 */
ArrayList.prototype.clear = function(){
    this.instance = new Array();
}
/** 
 * show all elements
 */
ArrayList.prototype.toString = function(sep){
    sep = sep || ", ";
    return this.instance.join(sep);
}
/**
 *
 */
function Properties(jsProps){
    this.instanceKeys = new ArrayList();
    this.instance = {};
    
    if (jsProps) {
        this.instance = jsProps;
        for (var i in jsProps) {
            this.instanceKeys.add(i);
        }
    }
}

/**
 * Returns the number of keys in this Properties.
 * @return int
 */
Properties.prototype.size = function(){
    return this.instanceKeys.size();
}

/**
 * Returns the value to which the specified key is mapped in this Properties.
 * @return value
 */
Properties.prototype.get = function(key, defaultValue){
    if (key == null) {
        return null;
    }
    
    var returnValue = this.instance[key];
    
    if (returnValue == null && defaultValue != null) {
        return defaultValue;
    }
    
    return returnValue;
}
/**
 * Removes the key (and its corresponding value) from this
 * Properties. This method does nothing if the key is not in the Properties.
 */
Properties.prototype.remove = function(key){
    if (key == null) {
        return null;
    }
    this.instanceKeys.remove(key);
    delete this.instance[key]
}
/**
 * Maps the specified <code>key</code> to the specified
 * <code>value</code> in this Properties. Neither the key nor the
 * value can be <code>null</code>. <p>
 *
 * The value can be retrieved by calling the <code>get</code> method
 * with a key that is equal to the original key.
 */
Properties.prototype.put = function(key, value){
    if (key == null) {
        return null;
    }
    
    if (this.instance[key] == null) {
        this.instanceKeys.add(key);
    }
    
    this.instance[key] = value;
}

/**
 * 直接追加，不考虑重复key
 */
Properties.prototype.putRef = function(key, value){
    if (key == null) {
        return null;
    }
    
    this.instanceKeys.add(key);
    this.instance[key] = value;
}

/**
 * Returns the value to which the specified value is mapped in this Properties.
 * e.g:
 * userinfo.getMultilevel("department.name")  the same sa :  userinfo.get("department").get("name")
 * @return string
 */
Properties.prototype.getMultilevel = function(key, defaultValue){
    if (key == null) {
        return null;
    }
    
    var _keys = key.split(".");
    
    function getObject(obj, keys, i){
        try {
            if (obj == null || (typeof obj != "object")) {
                return null;
            }
            
            var obj1 = obj.get(keys[i]);
            
            if (i < keys.length - 1) {
                obj1 = getObject(obj1, keys, i + 1);
            }
            
            return obj1;
        } 
        catch (e) {
        }
        
        return null;
    }
    
    var returnValue = getObject(this, _keys, 0);
    
    return returnValue == null ? defaultValue : returnValue;
}

/**
 * Tests if the specified object is a key in this Properties.
 * @return boolean
 */
Properties.prototype.containsKey = function(key){
    if (key == null) {
        return false;
    }
    
    return this.instance[key] != null;
}

/**
 * Returns an ArrayList of the keys in this Properties.
 * @return ArrayList
 */
Properties.prototype.keys = function(){
    return this.instanceKeys;
}

/**
 * Returns an ArrayList of the values in this Properties.
 * @return ArrayList
 */
Properties.prototype.values = function(){
    var vs = new ArrayList();
    for (var i = 0; i < this.instanceKeys.size(); i++) {
        var key = this.instanceKeys.get(i);
        
        if (key) {
            var value = this.instance[key];
            vs.add(value);
        }
    }
    
    return vs;
}

/**
 * Tests if this Properties maps no keys to values.
 * @return boolean
 */
Properties.prototype.isEmpty = function(){
    return this.instanceKeys.isEmpty();
}

/**
 * Clears this Properties so that it contains no keys.
 */
Properties.prototype.clear = function(){
    this.instanceKeys.clear();
    this.instance = {};
}
/**
 * exchange entry1(key1-value1) with entry2(key2-value2)
 */
Properties.prototype.swap = function(key1, key2){
    if (!key1 || !key2 || key1 == key2) {
        return;
    }
    
    var index1 = -1;
    var index2 = -1;
    
    for (var i = 0; i < this.instanceKeys.instance.length; i++) {
        if (this.instanceKeys.instance[i] == key1) {
            index1 = i;
        }
        else 
            if (this.instanceKeys.instance[i] == key2) {
                index2 = i;
            }
    }
    
    this.instanceKeys.instance[index1] = key2;
    this.instanceKeys.instance[index2] = key1;
}

Properties.prototype.entrySet = function(){
    var result = [];
    
    for (var i = 0; i < this.instanceKeys.size(); i++) {
        var key = this.instanceKeys.get(i);
        var value = this.instance[key];
        
        if (!key) {
            continue;
        }
        
        var o = new Object();
        o.key = key;
        o.value = value;
        
        result[result.length] = o;
    }
    
    return result;
}

/**
 *
 */
Properties.prototype.toString = function(){
    var str = "";
    
    for (var i = 0; i < this.instanceKeys.size(); i++) {
        var key = this.instanceKeys.get(i);
        str += key + "=" + this.instance[key] + "\n";
    }
    
    return str;
}
/**
 * 转换成key1=value1;key2=value2;的形式
 * token1 -- 对应第一层分隔符  如上式的";"
 * token2 -- 对应第二层分隔符  如上式的"="
 */
Properties.prototype.toStringTokenizer = function(token1, token2){
    token1 = token1 == null ? ";" : token1;
    token2 = token2 == null ? "=" : token2;
    var str = "";
    
    for (var i = 0; i < this.instanceKeys.size(); i++) {
        var key = this.instanceKeys.get(i);
        var value = this.instance[key];
        
        if (!key) {
            continue;
        }
        
        if (i > 0) {
            str += token1;
        }
        str += key + token2 + value;
    }
    
    return str;
}

Properties.prototype.toQueryString = function(){
    if (this.size() < 1) {
        return "";
    }
    
    var str = "";
    for (var i = 0; i < this.instanceKeys.size(); i++) {
        var key = this.instanceKeys.get(i);
        var value = this.instance[key];
        
        if (!key) {
            continue;
        }
        
        if (i > 0) {
            str += "&";
        }
        
        if (typeof value == "object") {
        
        }
        else {
            str += key + "=" + encodeURIat(value);
        }
    }
    
    return str;
}
