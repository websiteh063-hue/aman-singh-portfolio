const data = window.resumeData;

const iconMap = {
  phone: "P",
  mail: "E",
  "map-pin": "L",
  travelling: "TR",
  books: "BK"
};

function text(value) {
  return document.createTextNode(value);
}

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.append(text(content));
  return element;
}

function renderContact() {
  const contactList = document.getElementById("contactList");
  data.contact.forEach((item) => {
    const row = createElement("div", "contact-item");
    row.append(createElement("span", "contact-icon", iconMap[item.icon] || "-"));

    const value = item.href ? createElement("a", "", item.value) : createElement("span", "", item.value);
    if (item.href) value.href = item.href;
    row.append(value);
    contactList.append(row);
  });
}

function renderList(id, items) {
  const list = document.getElementById(id);
  items.forEach((item) => list.append(createElement("li", "", item)));
}

function renderEducation() {
  const list = document.getElementById("educationList");
  data.education.forEach((item) => {
    const row = createElement("article", "education-item");
    const title = createElement("h3", "");
    title.append(text(item.degree));
    if (item.status) {
      const status = createElement("span", "", ` (${item.status})`);
      status.style.fontWeight = "500";
      title.append(status);
    }
    row.append(title, createElement("p", "", item.school));
    list.append(row);
  });
}

function renderInterests() {
  const list = document.getElementById("interestList");
  data.interests.forEach((item) => {
    const row = createElement("div", "interest-item");
    row.append(
      createElement("span", "interest-icon", iconMap[item.toLowerCase()] || "*"),
      createElement("span", "", item)
    );
    list.append(row);
  });
}

function renderExperience() {
  const list = document.getElementById("experienceList");
  data.experience.forEach((job) => {
    const item = createElement("article", "experience-item");
    const top = createElement("div", "experience-top");
    const titleGroup = createElement("div", "");
    titleGroup.append(createElement("h3", "", job.company));
    titleGroup.append(createElement("p", "role", job.role));
    top.append(titleGroup, createElement("span", "period", job.period));

    const bullets = createElement("ul", "");
    job.bullets.forEach((bullet) => bullets.append(createElement("li", "", bullet)));
    item.append(top, bullets);
    list.append(item);
  });
}

function init() {
  document.getElementById("resumeName").textContent = data.name;
  document.getElementById("resumeTitle").textContent = data.title;
  document.getElementById("profileText").textContent = data.profile;
  document.getElementById("profilePhoto").src = data.photo;

  const portfolioLink = document.getElementById("portfolioLink");
  portfolioLink.href = data.portfolio.url;
  portfolioLink.textContent = data.portfolio.label;

  const portfolioQrLink = document.getElementById("portfolioQrLink");
  const portfolioQr = document.getElementById("portfolioQr");
  portfolioQrLink.href = data.portfolio.url;
  portfolioQr.src = data.portfolio.qr;

  renderContact();
  renderList("skillsList", data.skills);
  renderList("languageList", data.languages);
  renderEducation();
  renderInterests();
  renderExperience();
}

init();
