var DataTypes = require("sequelize").DataTypes;
var _USER = require("./USER");
var _addon = require("./addon");
var _category = require("./category");
var _empresa = require("./empresa");
var _faq = require("./faq");
var _images = require("./images");
var _license = require("./license");
var _licensestatus = require("./licensestatus");
var _notification = require("./notification");
var _notification_status = require("./notification_status");
var _package = require("./package");
var _payment = require("./payment");
var _payment_status = require("./payment_status");
var _plan = require("./plan");
var _plan_status = require("./plan_status");
var _price = require("./price");
var _produto = require("./produto");
var _produtos_do_pacote = require("./produtos_do_pacote");
var _requeriments = require("./requeriments");
var _support_ticket = require("./support_ticket");
var _ticket_status = require("./ticket_status");
var _ticketproduto = require("./ticketproduto");
var _user_status = require("./user_status");
var _user_type = require("./user_type");
var _version = require("./version");
const sequelize = require('./database');

function initModels() {
  var USER = _USER(sequelize, DataTypes);
  var addon = _addon(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var empresa = _empresa(sequelize, DataTypes);
  var faq = _faq(sequelize, DataTypes);
  var images = _images(sequelize, DataTypes);
  var license = _license(sequelize, DataTypes);
  var licensestatus = _licensestatus(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var notification_status = _notification_status(sequelize, DataTypes);
  var package = _package(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var payment_status = _payment_status(sequelize, DataTypes);
  var plan = _plan(sequelize, DataTypes);
  var plan_status = _plan_status(sequelize, DataTypes);
  var price = _price(sequelize, DataTypes);
  var produto = _produto(sequelize, DataTypes);
  var produtos_do_pacote = _produtos_do_pacote(sequelize, DataTypes);
  var requeriments = _requeriments(sequelize, DataTypes);
  var support_ticket = _support_ticket(sequelize, DataTypes);
  var ticket_status = _ticket_status(sequelize, DataTypes);
  var ticketproduto = _ticketproduto(sequelize, DataTypes);
  var user_status = _user_status(sequelize, DataTypes);
  var user_type = _user_type(sequelize, DataTypes);
  var version = _version(sequelize, DataTypes);

  package.belongsToMany(produto, { as: 'productid_produtos', through: produtos_do_pacote, foreignKey: "packageid", otherKey: "productid" });
  produto.belongsToMany(package, { as: 'packageid_packages', through: produtos_do_pacote, foreignKey: "productid", otherKey: "packageid" });
  produto.belongsToMany(support_ticket, { as: 'ticketid_support_tickets', through: ticketproduto, foreignKey: "productid", otherKey: "ticketid" });
  support_ticket.belongsToMany(produto, { as: 'productid_produto_ticketprodutos', through: ticketproduto, foreignKey: "ticketid", otherKey: "productid" });
  empresa.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(empresa, { as: "empresas", foreignKey: "userid"});
  license.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(license, { as: "licenses", foreignKey: "userid"});
  support_ticket.belongsTo(USER, { as: "user", foreignKey: "userid"});
  USER.hasMany(support_ticket, { as: "support_tickets", foreignKey: "userid"});
  price.belongsTo(addon, { as: "addon", foreignKey: "addonid"});
  addon.hasMany(price, { as: "prices", foreignKey: "addonid"});
  version.belongsTo(addon, { as: "addon", foreignKey: "addonid"});
  addon.hasMany(version, { as: "versions", foreignKey: "addonid"});
  package.belongsTo(category, { as: "category", foreignKey: "categoryid"});
  category.hasMany(package, { as: "packages", foreignKey: "categoryid"});
  produto.belongsTo(category, { as: "category", foreignKey: "categoryid"});
  category.hasMany(produto, { as: "produtos", foreignKey: "categoryid"});
  USER.belongsTo(empresa, { as: "business", foreignKey: "businessid"});
  empresa.hasMany(USER, { as: "USERs", foreignKey: "businessid"});
  plan.belongsTo(empresa, { as: "business", foreignKey: "businessid"});
  empresa.hasMany(plan, { as: "plans", foreignKey: "businessid"});
  license.belongsTo(licensestatus, { as: "lstatus", foreignKey: "lstatusid"});
  licensestatus.hasMany(license, { as: "licenses", foreignKey: "lstatusid"});
  USER.belongsTo(notification, { as: "notification", foreignKey: "notificationid"});
  notification.hasMany(USER, { as: "USERs", foreignKey: "notificationid"});
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
  addon.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(addon, { as: "addons", foreignKey: "productid"});
  faq.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(faq, { as: "faqs", foreignKey: "productid"});
  images.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(images, { as: "images", foreignKey: "productid"});
  price.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(price, { as: "prices", foreignKey: "productid"});
  produtos_do_pacote.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(produtos_do_pacote, { as: "produtos_do_pacotes", foreignKey: "productid"});
  ticketproduto.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(ticketproduto, { as: "ticketprodutos", foreignKey: "productid"});
  version.belongsTo(produto, { as: "product", foreignKey: "productid"});
  produto.hasMany(version, { as: "versions", foreignKey: "productid"});
  version.belongsTo(requeriments, { as: "req", foreignKey: "reqid"});
  requeriments.hasMany(version, { as: "versions", foreignKey: "reqid"});
  ticketproduto.belongsTo(support_ticket, { as: "ticket", foreignKey: "ticketid"});
  support_ticket.hasMany(ticketproduto, { as: "ticketprodutos", foreignKey: "ticketid"});
  support_ticket.belongsTo(ticket_status, { as: "tstatus", foreignKey: "tstatusid"});
  ticket_status.hasMany(support_ticket, { as: "support_tickets", foreignKey: "tstatusid"});
  USER.belongsTo(user_status, { as: "ustatus", foreignKey: "ustatusid"});
  user_status.hasMany(USER, { as: "USERs", foreignKey: "ustatusid"});
  USER.belongsTo(user_type, { as: "utype", foreignKey: "utypeid"});
  user_type.hasMany(USER, { as: "USERs", foreignKey: "utypeid"});

  return {
    USER,
    addon,
    category,
    empresa,
    faq,
    images,
    license,
    licensestatus,
    notification,
    notification_status,
    package,
    payment,
    payment_status,
    plan,
    plan_status,
    price,
    produto,
    produto_status,
    produtos_do_pacote,
    requeriments,
    support_ticket,
    ticket_status,
    ticketproduto,
    user_status,
    user_type,
    version,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
