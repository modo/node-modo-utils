var Inheritable = function () {
    this._parent = null;
};

Inheritable.prototype = {
    iget: function (name) {
        var value = this.get(name);

        if (value === undefined && this.getParent()) {
            value = this.getParent().iget(name);
        }

        return value;
    },
    setParent: function (inheritable) {
        this._parent = inheritable;
    },
    getParent: function () {
        return this._parent;
    }
};

module.exports = Inheritable;