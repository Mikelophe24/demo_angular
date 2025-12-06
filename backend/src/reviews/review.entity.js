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
exports.Review = void 0;
var typeorm_1 = require("typeorm");
var product_entity_1 = require("../products/product.entity");
var Review = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userName_decorators;
    var _userName_initializers = [];
    var _userName_extraInitializers = [];
    var _userImageUrl_decorators;
    var _userImageUrl_initializers = [];
    var _userImageUrl_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _product_decorators;
    var _product_initializers = [];
    var _product_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var Review = _classThis = /** @class */ (function () {
        function Review_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
            this.userImageUrl = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _userImageUrl_initializers, void 0));
            this.rating = (__runInitializers(this, _userImageUrl_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.comment = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
            this.title = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.createdAt = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.product = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _product_initializers, void 0));
            this.productId = (__runInitializers(this, _product_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            __runInitializers(this, _productId_extraInitializers);
        }
        return Review_1;
    }());
    __setFunctionName(_classThis, "Review");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _userName_decorators = [(0, typeorm_1.Column)()];
        _userImageUrl_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _rating_decorators = [(0, typeorm_1.Column)({ type: 'float' })];
        _comment_decorators = [(0, typeorm_1.Column)('text')];
        _title_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _product_decorators = [(0, typeorm_1.ManyToOne)(function () { return product_entity_1.Product; }, function (product) { return product.reviews; }, {
                onDelete: 'CASCADE',
            })];
        _productId_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: function (obj) { return "userName" in obj; }, get: function (obj) { return obj.userName; }, set: function (obj, value) { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
        __esDecorate(null, null, _userImageUrl_decorators, { kind: "field", name: "userImageUrl", static: false, private: false, access: { has: function (obj) { return "userImageUrl" in obj; }, get: function (obj) { return obj.userImageUrl; }, set: function (obj, value) { obj.userImageUrl = value; } }, metadata: _metadata }, _userImageUrl_initializers, _userImageUrl_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: function (obj) { return "product" in obj; }, get: function (obj) { return obj.product; }, set: function (obj, value) { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Review = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Review = _classThis;
}();
exports.Review = Review;
