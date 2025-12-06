"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var typeorm_1 = require("typeorm");
var order_item_entity_1 = require("./order-item.entity");
var Order = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _customerName_decorators;
    var _customerName_initializers = [];
    var _customerName_extraInitializers = [];
    var _customerEmail_decorators;
    var _customerEmail_initializers = [];
    var _customerEmail_extraInitializers = [];
    var _totalAmount_decorators;
    var _totalAmount_initializers = [];
    var _totalAmount_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var Order = _classThis = /** @class */ (function () {
        function Order_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.customerName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customerName_initializers, void 0));
            this.customerEmail = (__runInitializers(this, _customerName_extraInitializers), __runInitializers(this, _customerEmail_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _customerEmail_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.status = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.items = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            __runInitializers(this, _items_extraInitializers);
        }
        return Order_1;
    }());
    __setFunctionName(_classThis, "Order");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _customerName_decorators = [(0, typeorm_1.Column)()];
        _customerEmail_decorators = [(0, typeorm_1.Column)()];
        _totalAmount_decorators = [(0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 })];
        _status_decorators = [(0, typeorm_1.Column)({ default: 'PENDING' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _items_decorators = [(0, typeorm_1.OneToMany)(function () { return order_item_entity_1.OrderItem; }, function (item) { return item.order; }, { cascade: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _customerName_decorators, { kind: "field", name: "customerName", static: false, private: false, access: { has: function (obj) { return "customerName" in obj; }, get: function (obj) { return obj.customerName; }, set: function (obj, value) { obj.customerName = value; } }, metadata: _metadata }, _customerName_initializers, _customerName_extraInitializers);
        __esDecorate(null, null, _customerEmail_decorators, { kind: "field", name: "customerEmail", static: false, private: false, access: { has: function (obj) { return "customerEmail" in obj; }, get: function (obj) { return obj.customerEmail; }, set: function (obj, value) { obj.customerEmail = value; } }, metadata: _metadata }, _customerEmail_initializers, _customerEmail_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: function (obj) { return "totalAmount" in obj; }, get: function (obj) { return obj.totalAmount; }, set: function (obj, value) { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
}();
exports.Order = Order;
