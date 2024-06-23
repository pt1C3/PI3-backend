var DataTypes = require("sequelize").DataTypes;
var _USER = require("./USER");
var _addon = require("./addon");
var _business = require("./business");
var _category = require("./category");
var _faq = require("./faq");
var _images = require("./images");
var _license = require("./license");
var _license_status = require("./license_status");
var _notification = require("./notification");
var _notification_status = require("./notification_status");
var _package = require("./package");
var _payment = require("./payment");
var _payment_status = require("./payment_status");
var _plan = require("./plan");
var _plan_status = require("./plan_status");
var _price = require("./price");
var _product = require("./product");
var _product_status = require("./product_status");
var _produtos_do_pacote = require("./produtos_do_pacote");
var _requirements = require("./requirements");
var _support_ticket = require("./support_ticket");
var _ticket_replies = require("./ticket_replies");
var _ticket_status = require("./ticket_status");
var _ticketproduto = require("./ticketproduto");
var _user_status = require("./user_status");
var _user_type = require("./user_type");
var _version = require("./version");
var _version_status = require("./version_status");

function initModels(sequelize) {
  var USER = _USER(sequelize, DataTypes);
  var addon = _addon(sequelize, DataTypes);
  var business = _business(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var faq = _faq(sequelize, DataTypes);
  var images = _images(sequelize, DataTypes);
  var license = _license(sequelize, DataTypes);
  var license_status = _license_status(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var notification_status = _notification_status(sequelize, DataTypes);
  var package = _package(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var payment_status = _payment_status(sequelize, DataTypes);
  var plan = _plan(sequelize, DataTypes);
  var plan_status = _plan_status(sequelize, DataTypes);
  var price = _price(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var product_status = _product_status(sequelize, DataTypes);
  var produtos_do_pacote = _produtos_do_pacote(sequelize, DataTypes);
  var requirements = _requirements(sequelize, DataTypes);
  var support_ticket = _support_ticket(sequelize, DataTypes);
  var ticket_replies = _ticket_replies(sequelize, DataTypes);
  var ticket_status = _ticket_status(sequelize, DataTypes);
  var ticketproduto = _ticketproduto(sequelize, DataTypes);
  var user_status = _user_status(sequelize, DataTypes);
  var user_type = _user_type(sequelize, DataTypes);
  var version = _version(sequelize, DataTypes);
  var version_status = _version_status(sequelize, DataTypes);

  package.belongsToMany(product, { as: 'productid_products', through: produtos_do_pacote, foreignKey: "packageid", otherKey: "productid" });
  product.belongsToMany(package, { as: 'packageid_packages', through: produtos_do_pacote, foreignKey: "productid", otherKey: "packageid" });
  product.belongsToMany(support_ticket, { as: 'ticketid_support_tickets', through: ticketproduto, foreignKey: "productid", otherKey: "ticketid" });
  support_ticket.belongsToMany(product, { as: 'productid_product_ticketprodutos', through: ticketproduto, foreignKey: "ticketid", otherKey: "productid" });
  license.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(license, { as: "licenses", foreignKey: "userid"});
  notification.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(notification, { as: "notifications", foreignKey: "userid"});
  support_ticket.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(support_ticket, { as: "support_tickets", foreignKey: "userid"});
  price.belongsTo(addon, { as: "addon", foreignKey: "addonid"});
  addon.hasMany(price, { as: "prices", foreignKey: "addonid"});
  version.belongsTo(addon, { as: "addon", foreignKey: "addonid"});
  addon.hasMany(version, { as: "versions", foreignKey: "addonid"});
  USER.belongsTo(business, { as: "business", foreignKey: "businessid"});
  business.hasMany(USER, { as: "USERs", foreignKey: "businessid"});
  plan.belongsTo(business, { as: "business", foreignKey: "businessid"});
  business.hasMany(plan, { as: "plans", foreignKey: "businessid"});
  package.belongsTo(category, { as: "category", foreignKey: "categoryid"});
  category.hasMany(package, { as: "packages", foreignKey: "categoryid"});
  product.belongsTo(category, { as: "category", foreignKey: "categoryid"});
  category.hasMany(product, { as: "products", foreignKey: "categoryid"});
  license.belongsTo(license_status, { as: "lstatus", foreignKey: "lstatusid"});
  license_status.hasMany(license, { as: "licenses", foreignKey: "lstatusid"});
  notification.belongsTo(notification_status, { as: "nstatus", foreignKey: "nstatusid"});
  notification_status.hasMany(notification, { as: "notifications", foreignKey: "nstatusid"});
  faq.belongsTo(package, { as: "package", foreignKey: "packageid"});
  package.hasMany(faq, { as: "faqs", foreignKey: "packageid"});
  price.belongsTo(package, { as: "package", foreignKey: "packageid"});
  package.hasMany(price, { as: "prices", foreignKey: "packageid"});
  produtos_do_pacote.belongsTo(package, { as: "package", foreignKey: "packageid"});
  package.hasMany(produtos_do_pacote, { as: "produtos_do_pacotes", foreignKey: "packageid"});
  payment.belongsTo(payment_status, { as: "pstatus", foreignKey: "pstatusid"});
  payment_status.hasMany(payment, { as: "payments", foreignKey: "pstatusid"});
  license.belongsTo(plan, { as: "plan", foreignKey: "planid"});
  plan.hasMany(license, { as: "licenses", foreignKey: "planid"});
  payment.belongsTo(plan, { as: "plan", foreignKey: "planid"});
  plan.hasMany(payment, { as: "payments", foreignKey: "planid"});
  plan.belongsTo(plan_status, { as: "planstatus", foreignKey: "planstatusid"});
  plan_status.hasMany(plan, { as: "plans", foreignKey: "planstatusid"});
  plan.belongsTo(price, { as: "price", foreignKey: "priceid"});
  price.hasMany(plan, { as: "plans", foreignKey: "priceid"});
  addon.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(addon, { as: "addons", foreignKey: "productid"});
  faq.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(faq, { as: "faqs", foreignKey: "productid"});
  images.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(images, { as: "images", foreignKey: "productid"});
  price.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(price, { as: "prices", foreignKey: "productid"});
  produtos_do_pacote.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(produtos_do_pacote, { as: "produtos_do_pacotes", foreignKey: "productid"});
  ticketproduto.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(ticketproduto, { as: "ticketprodutos", foreignKey: "productid"});
  version.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(version, { as: "versions", foreignKey: "productid"});
  addon.belongsTo(product_status, { as: "status_product_status", foreignKey: "status"});
  product_status.hasMany(addon, { as: "addons", foreignKey: "status"});
  package.belongsTo(product_status, { as: "pstatus", foreignKey: "pstatusid"});
  product_status.hasMany(package, { as: "packages", foreignKey: "pstatusid"});
  product.belongsTo(product_status, { as: "status", foreignKey: "statusid"});
  product_status.hasMany(product, { as: "products", foreignKey: "statusid"});
  version.belongsTo(requirements, { as: "req", foreignKey: "reqid"});
  requirements.hasMany(version, { as: "versions", foreignKey: "reqid"});
  ticket_replies.belongsTo(support_ticket, { as: "ticket", foreignKey: "ticketid"});
  support_ticket.hasMany(ticket_replies, { as: "ticket_replies", foreignKey: "ticketid"});
  ticketproduto.belongsTo(support_ticket, { as: "ticket", foreignKey: "ticketid"});
  support_ticket.hasMany(ticketproduto, { as: "ticketprodutos", foreignKey: "ticketid"});
  support_ticket.belongsTo(ticket_status, { as: "tstatus", foreignKey: "tstatusid"});
  ticket_status.hasMany(support_ticket, { as: "support_tickets", foreignKey: "tstatusid"});
  USER.belongsTo(user_status, { as: "ustatus", foreignKey: "ustatusid"});
  user_status.hasMany(USER, { as: "USERs", foreignKey: "ustatusid"});
  USER.belongsTo(user_type, { as: "utype", foreignKey: "utypeid"});
  user_type.hasMany(USER, { as: "USERs", foreignKey: "utypeid"});
  version.belongsTo(version_status, { as: "status", foreignKey: "statusid"});
  version_status.hasMany(version, { as: "versions", foreignKey: "statusid"});

  return {
    USER,
    addon,
    business,
    category,
    faq,
    images,
    license,
    license_status,
    notification,
    notification_status,
    package,
    payment,
    payment_status,
    plan,
    plan_status,
    price,
    product,
    product_status,
    produtos_do_pacote,
    requirements,
    support_ticket,
    ticket_replies,
    ticket_status,
    ticketproduto,
    user_status,
    user_type,
    version,
    version_status,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
