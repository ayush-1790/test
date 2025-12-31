import { parseEmails } from "../utils/emailParser.js";
import { sendBulkEmails } from "../services/emailService.js";
import Email from "../models/Email.js";
import EmailHistory from "../models/EmailHistory.js";

const renderForm = (req, res) => {
  res.render("index", { results: null });
};

const handleSendEmails = async (req, res) => {
  try {
    const { subject, message, emails, tags } = req.body;

    let emailList = emails ? parseEmails(emails) : [];

    // Handle file upload
    if (req.file) {
      const fileContent = req.file.buffer.toString("utf8");
      const fileEmails = parseEmails(fileContent);
      emailList = [...new Set([...emailList, ...fileEmails])];
    }

    if (!subject || !message || emailList.length === 0) {
      return res.render("index", {
        results: [
          {
            email: "System",
            status: "Failed",
            error: "Subject, message, and at least one recipient are required.",
          },
        ],
      });
    }

    // Filter blocked contacts
    const blockedContacts = await Email.find({
      emailAddress: { $in: emailList },
      status: { $in: ["unsubscribed", "bounced", "complained"] },
    });

    const blockedEmails = blockedContacts.map(c => c.emailAddress);
    const validEmails = emailList.filter(e => !blockedEmails.includes(e));
    const skippedEmails = emailList.filter(e => blockedEmails.includes(e));

    // Send emails
    const results = await sendBulkEmails(validEmails, subject, message);

    // Update contacts
    const tagList = tags
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    for (const result of results) {
      if (result.status === "Sent") {
        await Email.updateOne(
          { emailAddress: result.email },
          {
            $set: { lastSentAt: new Date() },
            $addToSet: { tags: { $each: tagList } },
            $setOnInsert: { source: "manual", status: "subscribed" },
          },
          { upsert: true }
        );
      }
    }

    // Append skipped emails
    skippedEmails.forEach(email => {
      results.push({
        email,
        status: "Skipped",
        error: "Recipient is unsubscribed or bounced.",
      });
    });

    res.render("index", { results });

  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send emails");
  }
};

const renderHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.render("history", { history });
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
};

export default { renderForm, handleSendEmails, renderHistory };
