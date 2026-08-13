const $ = (s, root = document) => root.querySelector(s);
const state = JSON.parse(localStorage.getItem("gaia-state") || "{}");
state.role ||= "parent";
state.child ||= "Tomi";
state.language ||= "en";
state.simple ||= false;
state.dark ||= false;
const save = () => localStorage.setItem("gaia-state", JSON.stringify(state));
const routes = {};
const content = document.querySelector("#main");
const translations = {
  en: { how: "How it works", pricing: "Pricing", signin: "Sign in", create: "Create an account", hero: "Learning support that begins with listening.", lead: "Gaia connects autistic children with vetted, autism-trained educators for steady, personal support—at a pace that fits each child." },
  yo: { how: "Bí ó ṣe ń ṣiṣẹ́", pricing: "Iye owó", signin: "Wọlé", create: "Ṣẹ̀dá àkọọ́lẹ̀", hero: "Ìrànlọ́wọ́ ẹ̀kọ́ tó bẹ̀rẹ̀ pẹ̀lú fífetísílẹ̀.", lead: "Gaia ń so àwọn ọmọ autistic pọ̀ mọ́ àwọn olùkọ́ tí a ti yẹ̀wò ní Nàìjíríà fún ìrànlọ́wọ́ tí ó bá ọmọ kọ̀ọ̀kan mu." },
  ha: { how: "Yadda yake aiki", pricing: "Farashi", signin: "Shiga", create: "Buɗe asusu", hero: "Taimakon karatu yana farawa da sauraro.", lead: "Gaia tana haɗa yara masu autism da ƙwararrun malamai da aka tantance a Najeriya domin samun taimako da ya dace da kowane yaro." },
  ig: { how: "Otu o si arụ ọrụ", pricing: "Ọnụahịa", signin: "Banye", create: "Mepụta akaụntụ", hero: "Nkwado mmụta na-amalite site n’ige ntị.", lead: "Gaia na-ejikọta ụmụaka autistic na ndị nkuzi a nyochara na Naịjirịa maka nkwado dabara nwa ọ bụla." },
};

const icons = { back: "←", next: "→" };
const shell = (body, back = "#/") =>
  `<div class="narrow"><div class="page-head"><a class="back-link" href="${back}">${icons.back} Back</a>${body}</div></div>`;
const progress = (step, total, label) =>
  `<div class="progress-wrap"><div class="progress-label"><span>${label}</span><span>Step ${step} of ${total}</span></div><div class="progress" aria-label="Step ${step} of ${total}"><span style="width:${(step / total) * 100}%"></span></div></div>`;
const field = (
  label,
  id,
  type = "text",
  hint = "",
  value = "",
  required = true,
) =>
  `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${value}" ${required ? "required" : ""} aria-describedby="${id}-hint ${id}-error"><p id="${id}-hint" class="hint">${hint}</p><p id="${id}-error" class="field-error" aria-live="polite"></p></div>`;
const toast = (msg) => {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
};
const appShell = (role, active, body) =>
  `<div class="app-shell"><aside class="sidebar"><div class="context">Signed in as<br><strong>${role}</strong></div><nav class="side-nav" aria-label="${role} navigation">${navFor(
    role,
  )
    .map(
      ([name, url]) =>
        `<a href="${url}" class="${active === name ? "active" : ""}">${name}</a>`,
    )
    .join("")}</nav></aside><section class="app-main">${body}</section></div>`;
const navFor = (role) =>
  role === "Parent"
    ? [
        ["Overview", "#/parent"],
        ["Find an educator", "#/matches"],
        ["Support profile", "#/parent/profile"],
        ["Messages", "#/parent"],
        ["Billing", "#/pricing"],
      ]
    : role === "Educator"
      ? [
          ["Overview", "#/educator"],
          ["Sessions", "#/educator"],
          ["Students", "#/educator"],
          ["Availability", "#/educator"],
          ["Earnings", "#/educator"],
        ]
      : role === "Admin"
        ? [
            ["Verification", "#/admin"],
            ["Safety queue", "#/admin"],
            ["Profile flags", "#/admin"],
            ["Screening tools", "#/admin"],
          ]
        : [
            ["Today", "#/student"],
            ["Learning materials", "#/student"],
          ];

routes["/"] = () =>
  `<section class="hero"><div class="hero-copy"><p class="eyebrow">Personal learning support in Nigeria</p><h1>Learning support that begins with listening.</h1><p class="lead">Gaia connects autistic children with vetted, autism-trained educators for steady, personal support—at a pace that fits each child.</p><div class="button-row"><a class="button" href="#/signup">Create an account</a><a class="button secondary" href="#/how-it-works">See how Gaia works</a></div><p class="hint" style="margin-top:20px">For parents, educators and partner organisations across Nigeria.</p></div><div class="hero-media"><img src="assets/gaia-family-learning.png" alt="A Nigerian mother calmly supports her daughter during a learning activity" fetchpriority="high"></div></section><section class="trust-strip"><div class="trust-item"><strong>Educators are reviewed</strong><span>Credentials, identity and references checked</span></div><div class="trust-item"><strong>Your child's needs come first</strong><span>No labels or single support score</span></div><div class="trust-item"><strong>Private by design</strong><span>Controlled access to profiles and records</span></div></section><section class="section"><div class="container"><p class="eyebrow">A clear path to support</p><h2>What happens after you join</h2><div class="grid-3" style="margin-top:30px"><article class="card"><span class="step-number">1</span><h3>Tell us about your child</h3><p>Share how your child communicates, learns and experiences their environment. You can update this at any time.</p></article><article class="card"><span class="step-number">2</span><h3>Review suggested educators</h3><p>See a shortlist with clear reasons for each match. You choose who feels right.</p></article><article class="card"><span class="step-number">3</span><h3>Learn and adjust together</h3><p>Book sessions, follow goals and change the support plan when needs shift.</p></article></div></div></section><section class="section compact"><div class="container grid-2"><div class="quote-card"><blockquote>“The support profile describes what helps Tomi learn. It does not reduce her to a diagnosis.”</blockquote><strong>Adaeze, parent in Lagos</strong></div><div><p class="eyebrow">Built for real conditions</p><h2>Calm, private and data-conscious.</h2><p>Dashboards are lightweight and remain useful on slower connections. Live sessions can switch to audio-only or an assigned learning task.</p><a href="#/pricing" class="button secondary">View plans</a></div></div></section>${footer()}`;
routes["/how-it-works"] = () =>
  shell(
    `<p class="eyebrow">How Gaia works</p><h1 style="font-size:52px">Support shaped around one child at a time.</h1><div class="form-shell"><div class="timeline"><div class="timeline-item"><h3>Create a support profile</h3><p>A parent describes communication, sensory preferences, learning pace and current goals independently.</p></div><div class="timeline-item"><h3>Choose from a shortlist</h3><p>Gaia explains why each vetted educator may fit. The parent makes the decision.</p></div><div class="timeline-item"><h3>Book secure sessions</h3><p>Recording is off unless the parent gives explicit consent during booking.</p></div><div class="timeline-item"><h3>Review progress by goal</h3><p>Educators add brief structured notes. Families see changes without a reductive overall score.</p></div></div><a class="button" href="#/signup">Create an account</a></div>`,
  );
routes["/pricing"] = () =>
  `<section class="section"><div class="container"><a class="back-link" href="#/">← Back</a><p class="eyebrow">Simple monthly plans</p><h1 style="font-size:56px">Choose a steady learning rhythm.</h1><p class="lead">Every paid plan includes a parent feedback session each month. Session availability depends on your selected educator.</p><div class="pricing-grid" style="margin-top:36px"><article class="card price-card"><span class="tag info">Steady support</span><h3 style="margin-top:18px">2 sessions each week</h3><div class="price">₦50,000</div><p>per month</p><ul><li>Two 50-minute sessions each week</li><li>Goal-linked session notes</li><li>One parent feedback session monthly</li><li>Low-bandwidth options</li></ul><a class="button secondary" href="#/signup">Choose 2 sessions</a></article><article class="card price-card featured"><span class="tag">More frequent</span><h3 style="margin-top:18px">3 sessions each week</h3><div class="price">₦75,000</div><p>per month</p><ul><li>Three 50-minute sessions each week</li><li>Goal-linked session notes</li><li>One parent feedback session monthly</li><li>Low-bandwidth options</li></ul><a class="button" href="#/signup">Choose 3 sessions</a></article><article class="card price-card sponsor"><span class="tag action">Partner-supported</span><h3 style="margin-top:18px">Sponsored / discounted</h3><div class="price">Partner set</div><p>for approved families</p><ul><li>For NGO or sponsor referrals</li><li>Separate eligibility confirmation</li><li>No discount code needed</li><li>Same care and privacy standards</li></ul><a class="button clay" href="#/sponsor">I have a sponsorship / NGO partner</a></article></div><div class="notice" style="margin-top:28px"><strong>No surprise charges.</strong> You will see the monthly price and schedule before confirming your first booking.</div></div></section>`;
routes["/sponsor"] = () =>
  shell(
    `<p class="eyebrow">Partner-supported access</p><h1 style="font-size:50px">Tell us about your referral.</h1><p>Gaia will confirm eligibility directly with the partner organisation. This is separate from paid plan checkout.</p><form class="form-shell" data-next="/signup/parent">${field("Parent or guardian name", "sname")}${field("Child’s first name", "schild", "", "We ask this so we can identify the correct referral.")}${field("NGO or sponsor name", "ngo", "", "Enter the organisation that referred you.")}${field("Referral ID, if provided", "ref", "", "You can leave this blank.", "", false)}<label class="consent-option"><input type="checkbox" required> I agree that Gaia may contact the named partner to confirm this referral.</label><button class="primary" type="submit">Continue with sponsored access</button></form>`,
    "#/pricing",
  );
routes["/signup"] = () =>
  shell(
    `<p class="eyebrow">Create an account</p><h1 style="font-size:52px">How will you use Gaia?</h1><p class="lead">Choose one account type. Each role has different access and responsibilities.</p><div class="role-grid" style="margin:30px 0 110px"><a class="role-card" href="#/signup/parent"><h3>I’m a Parent / Guardian</h3><span>Find learning support and manage your child’s profile and sessions.</span></a><a class="role-card" href="#/signup/educator"><h3>I’m an Educator / Tutor</h3><span>Apply for verification and support matched students.</span></a><a class="role-card admin" href="#/signup/admin"><h3>I’m an Admin</h3><span>Admin accounts are invite-only. You will need an invitation.</span></a></div>`,
  );
const signupForm = (role) =>
  shell(
    `<p class="eyebrow">${role} account</p><h1 style="font-size:48px">Create your sign-in details.</h1><form class="form-shell" data-signup="${role.toLowerCase()}"><div class="form-grid">${field("Full name", "name", "", "Use the name you want us to use.")}${field("Email address", "email", "email", "We will send a verification link.")}${field("Phone number", "phone", "tel", "Use a Nigerian number we can reach.")}${field("Password", "password", "password", "Use at least 8 characters, including one number.")}</div><div class="field"><label for="preferred">Preferred language</label><select id="preferred"><option>English</option><option>Hausa</option><option>Yoruba</option><option>Igbo</option></select></div><button class="primary" type="submit">Create ${role.toLowerCase()} account</button><p class="hint">By continuing, you agree to Gaia’s privacy and safeguarding terms.</p></form>`,
    "#/signup",
  );
routes["/signup/parent"] = () => signupForm("Parent");
routes["/signup/educator"] = () => signupForm("Educator");
routes["/signup/admin"] = () =>
  shell(
    `<p class="eyebrow">Admin access</p><h1 style="font-size:50px">An invitation is required.</h1><div class="form-shell"><p>Gaia admin accounts are provisioned by an authorised platform lead. Public admin registration is not available.</p>${field("Work email", "admin-email", "email", "Enter the address that received your invitation.")}${field("Invitation code", "invite", "", "This code is provided securely by Gaia.")}<button class="primary" data-go="/admin">Verify invitation</button></div>`,
    "#/signup",
  );
routes["/verify"] = () =>
  shell(
    `<p class="eyebrow">Check your email</p><h1 style="font-size:50px">Verify your email to continue.</h1><div class="form-shell"><p>We sent a verification link to <strong>${state.email || "your email address"}</strong>. Open the link, then return here.</p><div class="notice">For this prototype, the button below completes verification.</div><button class="primary" data-go="/${state.role}-onboarding/1">I have verified my email</button><button class="secondary" type="button" style="margin-left:8px" data-toast="A new verification email has been sent.">Send again</button></div>`,
    "#/signup",
  );
routes["/signin"] = () =>
  shell(
    `<p class="eyebrow">Welcome back</p><h1 style="font-size:52px">Sign in to Gaia.</h1><form class="form-shell" id="signin-form"><div class="field"><label>Account type</label><div class="choice-grid"><div class="choice"><input id="rp" name="role" type="radio" value="parent" checked><label for="rp">Parent / Guardian</label></div><div class="choice"><input id="re" name="role" type="radio" value="educator"><label for="re">Educator / Tutor</label></div><div class="choice"><input id="rs" name="role" type="radio" value="student"><label for="rs">Student</label></div><div class="choice"><input id="ra" name="role" type="radio" value="admin"><label for="ra">Admin</label></div></div></div>${field("Email address", "login-email", "email")}${field("Password", "login-password", "password")}<button class="primary" type="submit">Sign in</button><a href="#/forgot" style="margin-left:14px">Forgot password?</a></form>`,
  );
routes["/forgot"] = () =>
  shell(
    `<h1 style="font-size:50px">Reset your password.</h1><form class="form-shell" data-next="/signin">${field("Email address", "reset-email", "email", "We will send a secure reset link.")}<button class="primary">Send reset link</button></form>`,
    "#/signin",
  );

routes["/parent-onboarding/1"] = () =>
  onboard(
    1,
    "Register your child",
    `${field("Child’s first name", "child-name", "", "This is the name educators will use.")}<div class="form-grid">${field("Date of birth", "dob", "date")}<div class="field"><label for="child-lang">Child’s preferred language</label><select id="child-lang"><option>English</option><option>Yoruba</option><option>Hausa</option><option>Igbo</option><option>Uses few or no spoken words</option></select></div></div>`,
    "/parent-onboarding/2",
  );
routes["/parent-onboarding/2"] = () =>
  onboard(
    2,
    "Help us understand your child",
    `<p>Use your own words. There are no right or wrong answers.</p><div class="field"><label for="communication">How does your child communicate best?</label><textarea id="communication" placeholder="For example: short spoken phrases, pointing, pictures, a communication device..."></textarea></div><div class="field"><label for="sensory">What sensory experiences help or make learning harder?</label><textarea id="sensory" placeholder="For example: works best in a quiet room and may need movement breaks..."></textarea></div><div class="field"><label for="history">What learning or therapy support have they had before?</label><textarea id="history" placeholder="Share only what feels relevant."></textarea></div>`,
    "/parent-onboarding/3",
  );
routes["/parent-onboarding/3"] = () =>
  onboard(
    3,
    "Build the support profile",
    `<p>Rate each area separately. This will never become a single “type” or score.</p>${rating("Communication support")}${rating("Sensory consideration")}${rating("Learning pace support")}${rating("Behavioural support")}${rating("Academic focus")}<div class="notice"><strong>Have a professional report?</strong><br>You may upload it instead of completing every rating.<br><input type="file" accept=".pdf,.jpg,.png" style="margin-top:10px"></div>`,
    "/parent-onboarding/4",
  );
routes["/parent-onboarding/4"] = () =>
  onboard(
    4,
    "Choose availability and a plan",
    `<div class="field"><label>Preferred session times</label><div class="choice-grid">${choice("Weekday mornings", "am")}${choice("Weekday afternoons", "pm")}${choice("Weekday evenings", "eve")}${choice("Saturday", "sat")}</div></div><div class="field"><label>Monthly plan</label><div class="choice-grid">${choice("2 sessions weekly — ₦50,000/month", "p2", "plan")}${choice("3 sessions weekly — ₦75,000/month", "p3", "plan")}${choice("I have a sponsorship / NGO partner", "ps", "plan")}</div><p class="hint">All plans include one parent feedback session each month.</p></div>`,
    "/parent-onboarding/5",
  );
routes["/parent-onboarding/5"] = () =>
  onboard(
    5,
    "Review the support summary",
    `<div class="card tinted"><span class="tag">Editable at any time</span><h3 style="margin-top:16px">${state.child || "Tomi"} learns best with</h3><ul class="check-list"><li>Short spoken instructions with visual examples</li><li>A calm room and a short movement break</li><li>Extra time to respond without being rushed</li><li>Current focus: communication and early reading</li></ul></div><div class="notice"><strong>A separate child login will be created.</strong> You will manage the password and access. The child view has no billing or account settings.</div>`,
    "/matches",
    "Find suggested educators",
  );
function onboard(n, title, fields, next, button = "Continue") {
  return shell(
    `${progress(n, 5, "Parent setup")}<h1 style="font-size:48px">${title}</h1><form class="form-shell parent-step" data-next="${next}" data-step="${n}">${fields}<div class="button-row" style="margin-top:28px"><button class="primary" type="submit">${button} ${icons.next}</button></div></form>`,
    n === 1 ? "#/verify" : `#/parent-onboarding/${n - 1}`,
  );
}
function rating(name) {
  const key = name.replaceAll(" ", "-");
  return `<div class="rating-row"><strong>${name}</strong>${["Occasional", "Regular", "High"].map((v, i) => `<label><input type="radio" name="${key}" value="${v}" ${i === 1 ? "checked" : ""}> ${v}</label>`).join("")}</div>`;
}
function choice(label, id, name = "availability") {
  return `<div class="choice"><input type="checkbox" id="${id}" name="${name}"><label for="${id}">${label}</label></div>`;
}

routes["/educator-onboarding/1"] = () =>
  educatorOnboard(
    1,
    "Tell us about your experience",
    `${field("Highest relevant qualification", "qual")}${field("Autism-specific training or certification", "cert", "", "List the course and awarding organisation.")}<div class="form-grid">${field("Years supporting autistic learners", "years", "number")}${field("Specialisation areas", "special", "", "For example: communication, literacy, mathematics.")}</div>`,
  );
routes["/educator-onboarding/2"] = () =>
  educatorOnboard(
    2,
    "Upload verification documents",
    `<p>Files are encrypted and only the verification team can access them.</p>${upload("Government-issued ID", "id-file")}${upload("Qualifications and certificates", "cert-file")}${upload("Two professional references", "ref-file")}`,
  );
routes["/educator-onboarding/3"] = () =>
  educatorOnboard(
    3,
    "Set your teaching preferences",
    `<div class="form-grid"><div class="field"><label for="ages">Age groups supported</label><select id="ages"><option>4–7 years</option><option>8–12 years</option><option>13–17 years</option></select></div>${field("Maximum sessions each week", "capacity", "number")}</div><div class="field"><label>Languages</label><div class="choice-grid">${choice("English", "e1")}${choice("Yoruba", "e2")}${choice("Hausa", "e3")}${choice("Igbo", "e4")}</div></div>${field("Available days and times", "ed-avail", "", "For example: Tuesday and Thursday, 3pm–7pm.")}`,
  );
routes["/educator-onboarding/4"] = () =>
  shell(
    `${progress(4, 4, "Educator setup")}<h1 style="font-size:48px">Your review is pending.</h1><div class="form-shell"><span class="tag action">Verification in progress</span><h3 style="margin-top:20px">What happens next</h3><p>Our safeguarding team will review your identity, training documents and references. This usually takes 3–5 working days.</p><p>We will email you if any document needs attention. You cannot accept bookings until approval.</p><button class="primary" data-go="/educator">Go to educator dashboard</button></div>`,
    "#/educator-onboarding/3",
  );
function educatorOnboard(n, title, fields) {
  return shell(
    `${progress(n, 4, "Educator setup")}<h1 style="font-size:48px">${title}</h1><form class="form-shell" data-next="/educator-onboarding/${n + 1}">${fields}<button class="primary">Continue →</button></form>`,
    n === 1 ? "#/verify" : `#/educator-onboarding/${n - 1}`,
  );
}
function upload(label, id) {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="file" accept=".pdf,.jpg,.png"><p class="hint">PDF, JPG or PNG. Maximum 10 MB.</p></div>`;
}

routes["/parent"] = () =>
  appShell(
    "Parent",
    "Overview",
    `<div class="dashboard-head"><div><p class="eyebrow">Thursday, 13 August</p><h1>Hello, Adaeze.</h1><p>Here is what is happening for ${state.child || "Tomi"}.</p></div><a class="button secondary" href="#/matches">Find an educator</a></div><article class="session-card"><div class="date-box"><span>Aug</span><strong>14</strong></div><div><span class="tag info">Tomorrow at 4:00 pm</span><h3 style="margin-top:10px">Communication and reading with Amara</h3><p style="margin:0">50 minutes · Video session · Recording off</p></div><a class="button" href="#/session">Join session</a></article><div class="dashboard-grid"><article class="card"><div class="dashboard-head"><div><p class="eyebrow">Progress by goal</p><h3>Using words to make choices</h3></div><span class="tag">Steady progress</span></div><div class="timeline"><div class="timeline-item"><strong>Goal agreed</strong><p>Use a word or picture to choose between two activities.</p></div><div class="timeline-item"><strong>5 August · Session 3</strong><p>Chose a preferred book independently on 3 of 4 opportunities.</p></div><div class="timeline-item"><strong>12 August · Plan adjusted</strong><p>Add choice-making during short reading activities.</p></div></div><a href="#/parent/profile">View all goals</a></article><aside><article class="card"><p class="eyebrow">Support profile</p><h3>${state.child || "Tomi"}’s learning supports</h3><p>Visual examples · quiet setting · unhurried response time</p><a href="#/parent/profile">Update profile</a></article><article class="card" style="margin-top:18px"><p class="eyebrow">Messages</p><h3>One new note</h3><p>Amara added a preparation note for tomorrow.</p><a href="#/parent">Read message</a></article></aside></div>`,
  );
routes["/parent/profile"] = () =>
  appShell(
    "Parent",
    "Support profile",
    `<a class="back-link" href="#/parent">← Back to dashboard</a><div class="dashboard-head"><div><p class="eyebrow">Support profile</p><h1>${state.child || "Tomi"}’s profile</h1><p>This describes helpful support. It is not a diagnosis or category.</p></div><button class="secondary" data-toast="Editing is enabled. Changes are saved as a draft.">Update profile</button></div><div class="grid-2"><article class="card"><h3>Communication</h3><p>Uses short phrases and pictures. Give time to respond before repeating a question.</p></article><article class="card"><h3>Sensory considerations</h3><p>Works best in a quiet room with low background noise. Offer a movement break after 20 minutes.</p></article><article class="card"><h3>Learning pace</h3><p>Introduce one new idea at a time and show a completed example first.</p></article><article class="card"><h3>Current goals</h3><p>Making choices with words or pictures; recognising common written words.</p></article></div>`,
  );
routes["/matches"] = () =>
  appShell(
    "Parent",
    "Find an educator",
    `<a class="back-link" href="#/parent">← Back to dashboard</a><p class="eyebrow">Your suggested educators</p><h1 style="font-size:48px">Three educators may fit ${state.child || "Tomi"}’s needs.</h1><p>Suggestions are ranked by relevant support experience, language and your availability. You decide whom to contact.</p><div style="display:grid;gap:16px;margin-top:28px">${educatorCard("Amara Okafor", "Communication & early literacy", "Yoruba and English · Tuesdays and Thursdays", "#/educator-profile", true)}${educatorCard("Chidi Nwosu", "Literacy & sensory-aware teaching", "English and Igbo · Mondays and Saturdays", "#/educator-profile")}${educatorCard("Bola Adeyemi", "Communication & play-based learning", "Yoruba and English · Wednesday afternoons", "#/educator-profile")}</div>`,
  );
function educatorCard(name, speciality, reason, url, photo = false) {
  return `<article class="card educator-card">${photo ? '<img src="assets/educator-amara.png" alt="Portrait of educator Amara Okafor" loading="lazy">' : '<div class="avatar" style="background:var(--sage-soft);display:grid;place-items:center"><strong>Profile<br>photo</strong></div>'}<div><span class="verified">Verified educator</span><h3>${name}</h3><p style="margin:0">${speciality} · 7 years’ experience</p><div class="match-reason"><strong>Why suggested:</strong> ${reason}</div></div><a class="button secondary" href="${url}">View profile</a></article>`;
}
routes["/educator-profile"] = () =>
  appShell(
    "Parent",
    "Find an educator",
    `<a class="back-link" href="#/matches">← Back to matches</a><div class="profile-hero"><img src="assets/educator-amara.png" alt="Portrait of Amara Okafor"><div><span class="verified">Verified educator · Identity and credentials checked</span><h1 style="font-size:46px">Amara Okafor</h1><p class="lead">Autism-trained educator supporting communication, early literacy and predictable learning routines.</p><p>PGDE, University of Lagos · Autism Education Certificate · 7 years’ experience</p></div></div><div class="grid-2" style="margin-top:30px"><section><article class="card"><h3>About Amara</h3><p>I use clear routines, visual supports and short learning activities. I work with families to understand what makes participation easier for each child.</p><h3>Languages</h3><p>English and Yoruba</p></article><h3 style="margin-top:26px">Choose an available time</h3><div class="calendar">${["Tue 18 · 4:00", "Tue 18 · 5:00", "Thu 20 · 3:00", "Thu 20 · 4:00"].map((x, i) => `<button class="slot ${i === 0 ? "selected" : ""}">${x}</button>`).join("")}</div></section><aside class="card booking-summary"><p class="eyebrow">Booking summary</p><h3>Tuesday, 18 August</h3><p>4:00 pm · 50 minutes<br>Video, with audio-only fallback</p><hr style="border:0;border-top:1px solid var(--line)"><p><strong>3 sessions weekly</strong><br>₦75,000/month</p><a class="button" href="#/booking-consent">Continue to consent</a></aside></div>`,
  );
routes["/booking-consent"] = () =>
  appShell(
    "Parent",
    "Find an educator",
    `<a class="back-link" href="#/educator-profile">← Back to educator</a><p class="eyebrow">Booking step 2 of 2</p><h1 style="font-size:48px">Choose whether sessions may be recorded.</h1><p class="lead">Recording is optional. Your choice will not affect access to teaching.</p><form class="form-shell" data-next="/booking-confirmed" data-recording><label class="consent-option"><input type="radio" name="record" value="no" checked> <strong>Do not record sessions</strong><span class="hint">No video or audio file will be saved.</span></label><label class="consent-option"><input type="radio" name="record" value="yes"> <strong>I consent to recording</strong><span class="hint">Only you, Amara and an authorised reviewer handling a specific flagged issue can access it.</span></label><div class="notice">You can withdraw consent for future sessions at any time. Existing records follow the retention policy shown in your account.</div><button class="primary">Confirm booking</button></form>`,
  );
routes["/booking-confirmed"] = () =>
  appShell(
    "Parent",
    "Find an educator",
    `<div class="narrow" style="width:100%"><span class="tag">Booking confirmed</span><h1 style="font-size:52px;margin-top:18px">Your first session with Amara is booked.</h1><div class="card"><h3>Tuesday, 18 August at 4:00 pm</h3><p>50 minutes · Video with audio-only fallback · Recording off</p><p><strong>Plan:</strong> 3 sessions each week · ₦75,000/month</p><div class="notice"><strong>Confirmation sent</strong><br>We sent details in Gaia and by WhatsApp-style message to the phone number on your account.</div><a class="button" href="#/parent">Go to dashboard</a></div></div>`,
  );

routes["/educator"] = () =>
  appShell(
    "Educator",
    "Overview",
    `<div class="dashboard-head"><div><span class="tag action">Verification pending</span><h1 style="margin-top:14px">Hello, Amara.</h1><p>Your documents are under review. You can prepare your availability now.</p></div><button class="secondary" data-toast="Availability editor opened for this prototype.">Manage availability</button></div><div class="stat-row"><div class="stat"><span>Sessions this week</span><strong>6</strong></div><div class="stat"><span>Active students</span><strong>3</strong></div><div class="stat"><span>August earnings</span><strong>₦150,000</strong></div></div><article class="session-card"><div class="date-box"><span>Today</span><strong>4:00</strong></div><div><span class="tag info">Upcoming</span><h3 style="margin-top:10px">Session with ${state.child || "Tomi"}</h3><p style="margin:0">Relevant supports: visual choices · quiet setting · wait time</p></div><a class="button" href="#/session">Open session</a></article><div class="dashboard-grid"><article class="card"><h3>Structured session note</h3><div class="field"><label for="goal">Goal worked on</label><select id="goal"><option>Using words or pictures to make choices</option><option>Recognising common written words</option></select></div><div class="field"><label for="observed">What was observed?</label><textarea id="observed" placeholder="Use a short, factual observation."></textarea></div><button class="primary" data-toast="Session note saved as a draft.">Save draft</button></article><article class="card"><h3>Student information boundary</h3><p>You can see teaching-relevant support information only. Medical records and parent billing are not available to educators.</p></article></div>`,
  );
routes["/student"] = () =>
  appShell(
    "Student",
    "Today",
    `<div class="student-view"><div class="student-card"><p class="eyebrow">Today</p><h1>Learning with Amara</h1><p class="lead">Your session starts at 4:00 pm. You can join when your parent says it is time.</p><a class="button join-big" href="#/session">Join session</a><div class="card" style="margin-top:26px;text-align:left"><h3>Your learning materials</h3><p>Picture choices · My reading words</p></div></div></div>`,
  );
routes["/admin"] = () =>
  appShell(
    "Admin",
    "Verification",
    `<div class="dashboard-head"><div><p class="eyebrow">Admin console</p><h1>Verification queue</h1><p>Review only the information needed for this decision.</p></div><span class="tag action">4 need action</span></div><div class="stat-row"><div class="stat"><span>Awaiting review</span><strong>4</strong></div><div class="stat"><span>Safety escalations</span><strong>1</strong></div><div class="stat"><span>Profile flags</span><strong>2</strong></div></div><div class="table-wrap"><table><thead><tr><th>Applicant</th><th>Submitted</th><th>Checks</th><th>Status</th><th>Action</th></tr></thead><tbody><tr><td><strong>Amara Okafor</strong></td><td>11 Aug 2026</td><td>ID · Certificate · 2 refs</td><td><span class="tag action">Needs review</span></td><td><button class="secondary" data-toast="Review panel opened.">Review</button></td></tr><tr><td><strong>Ife Bello</strong></td><td>10 Aug 2026</td><td>ID · Certificate · 1 ref</td><td><span class="tag info">Waiting for reference</span></td><td><button class="secondary" data-toast="Applicant details opened.">View</button></td></tr></tbody></table></div><div class="grid-2" style="margin-top:24px"><article class="card"><h3>Safety and dispute queue</h3><p>One new concern requires a safeguarding reviewer. Recording access remains locked until assigned.</p><button class="secondary" data-toast="Safety queue opened.">Open safety queue</button></article><article class="card"><h3>Screening tool oversight</h3><p>Last content review: 5 August 2026. No tools are presented as diagnostic.</p><button class="secondary" data-toast="Screening tools opened.">Manage tools</button></article></div>`,
  );
routes["/session"] = () =>
  `<div class="session-screen"><div class="video-stage"><div class="recording" hidden>Recording on</div><div class="video-person"><div><h2>Amara’s camera</h2><p style="color:#d8ddd9">Video preview is simulated in this prototype.</p><button class="secondary" style="color:#fff;border-color:#fff" data-toast="Switched to audio-only mode.">Connection is poor? Use audio only</button><br><button style="margin-top:12px;background:none;border:0;color:#d8ddd9;text-decoration:underline" data-toast="Async learning task assigned. You can leave the call.">Use a learning task instead</button></div></div></div><div class="call-controls"><button data-toggle="muted">Mute microphone</button><button data-toggle="camera">Turn camera off</button><button data-toast="Captions turned on.">Turn captions on</button><a class="button leave" href="#/${state.role === "student" ? "student" : state.role === "educator" ? "educator" : "parent"}">Leave session</a></div></div>`;
function footer() {
  return `<footer class="footer"><div class="container footer-grid"><div><a class="wordmark" href="#/">Gaia</a><p>Personal learning support for autistic children in Nigeria.</p></div><p>Privacy · Safeguarding · Accessibility<br>Help: support@gaia.example</p></div></footer>`;
}

function bind() {
  $$("[data-go]").forEach((el) =>
    el.addEventListener("click", () => (location.hash = "#" + el.dataset.go)),
  );
  $$("[data-toast]").forEach((el) =>
    el.addEventListener("click", () => toast(el.dataset.toast)),
  );
  $$("form[data-next]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      location.hash = "#" + form.dataset.next;
    }),
  );
  const recordingForm = $("form[data-recording]");
  if (recordingForm)
    recordingForm.addEventListener("submit", () => {
      state.recording = new FormData(recordingForm).get("record") === "yes";
      save();
    });
  const sign = $("form[data-signup]");
  if (sign)
    sign.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(sign)) return;
      state.role = sign.dataset.signup;
      state.email = $("#email").value;
      if ($("#child-name")) state.child = $("#child-name").value;
      save();
      location.hash = "#/verify";
    });
  const login = $("#signin-form");
  if (login)
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(login)) return;
      state.role = new FormData(login).get("role");
      save();
      location.hash = "#/" + state.role;
    });
  const child = $("#child-name");
  if (child)
    child.addEventListener("input", () => {
      state.child = child.value;
      save();
    });
  $$(".slot").forEach((el) =>
    el.addEventListener("click", () => {
      $$(".slot").forEach((x) => x.classList.remove("selected"));
      el.classList.add("selected");
    }),
  );
  $$("[data-toggle]").forEach((el) =>
    el.addEventListener("click", () => {
      const on = el.getAttribute("aria-pressed") === "true";
      el.setAttribute("aria-pressed", String(!on));
      el.textContent =
        el.dataset.toggle === "muted"
          ? on
            ? "Mute microphone"
            : "Unmute microphone"
          : on
            ? "Turn camera off"
            : "Turn camera on";
    }),
  );
}
function $$(s, root = document) {
  return [...root.querySelectorAll(s)];
}
function validate(form) {
  let ok = true;
  $$("[required]", form).forEach((el) => {
    const error = $("#" + el.id + "-error");
    if ((el.type === "checkbox" && !el.checked) || !el.value.trim()) {
      ok = false;
      el.setAttribute("aria-invalid", "true");
      if (error)
        error.textContent = `Please enter ${($(`label[for="${el.id}"]`)?.textContent || "this information").toLowerCase()}.`;
    } else {
      el.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }
  });
  const pass = $("#password");
  if (pass && (pass.value.length < 8 || !/\d/.test(pass.value))) {
    ok = false;
    $("#password-error").textContent =
      "Use at least 8 characters, including one number.";
  }
  return ok;
}
function render() {
  let path = location.hash.slice(1) || "/";
  const view = routes[path] || routes["/"];
  content.innerHTML = view();
  document.body.classList.toggle(
    "app-page",
    path.startsWith("/parent") ||
      path.startsWith("/educator") ||
      path.startsWith("/admin") ||
      path.startsWith("/student"),
  );
  $(".site-header").style.display = path === "/session" ? "none" : "";
  if (path === "/session" && state.recording)
    $(".recording")?.removeAttribute("hidden");
  applyLanguage(path);
  window.scrollTo(0, 0);
  bind();
  content.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
function applyLanguage(path) {
  const copy = translations[state.language] || translations.en;
  $$('[data-i18n]').forEach((el) => {
    if (copy[el.dataset.i18n]) el.textContent = copy[el.dataset.i18n];
  });
  if (path === "/" && state.language !== "en") {
    const heading = $(".hero-copy h1");
    const lead = $(".hero-copy .lead");
    if (heading) heading.textContent = copy.hero;
    if (lead) lead.textContent = copy.lead;
  }
}
$(".menu-button").addEventListener("click", (e) => {
  const nav = $("#mobile-nav");
  nav.hidden = !nav.hidden;
  e.currentTarget.setAttribute("aria-expanded", String(!nav.hidden));
});
$("#motion-toggle").addEventListener("click", (e) => {
  state.simple = !state.simple;
  document.body.classList.toggle("simplified", state.simple);
  e.currentTarget.textContent = `Simplify view: ${state.simple ? "On" : "Off"}`;
  e.currentTarget.setAttribute("aria-pressed", String(state.simple));
  save();
});
$("#theme-toggle").addEventListener("click", (e) => {
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
  e.currentTarget.textContent = `Low-light: ${state.dark ? "On" : "Off"}`;
  e.currentTarget.setAttribute("aria-pressed", String(state.dark));
  save();
});
$("#language-select").addEventListener("change", (e) => {
  state.language = e.target.value;
  save();
  render();
  toast(e.target.value === "en" ? "Language set to English" : "Language preference applied.");
});
document.body.classList.toggle("simplified", state.simple);
document.body.classList.toggle("dark", state.dark);
$("#motion-toggle").textContent =
  `Simplify view: ${state.simple ? "On" : "Off"}`;
$("#language-select").value = state.language;
$("#theme-toggle").textContent = `Low-light: ${state.dark ? "On" : "Off"}`;
window.addEventListener("hashchange", render);
render();
if ("serviceWorker" in navigator)
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
