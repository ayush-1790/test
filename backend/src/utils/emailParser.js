export const parseEmails = (emailString) => {
  return emailString.split(/[\r\n,]+/).map(e => e.trim()).filter(e => e);
};