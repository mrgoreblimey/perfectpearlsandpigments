import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Terms & Conditions — Perfect Pearls & Pigments",
};

const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      "These terms and conditions outline the rules and regulations for the use of Perfect Pearls and Pigments' website, located at perfectpearlsandpigments.co.uk.",
      "By accessing this website, we assume you accept these terms and conditions. Do not continue to use the website if you do not agree to take all of the terms and conditions stated on this page.",
      "“Client”, “You” and “Your” refers to you, the person using this website. “The Company”, “Ourselves”, “We”, “Our” and “Us” refers to our company. “Party” or “Parties” refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to provide our services to the Client, in accordance with and subject to the prevailing law of the United Kingdom.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    body: [
      "We employ the use of cookies. By accessing the website, you agree to the use of cookies in agreement with our Privacy Policy.",
      "Most interactive websites use cookies to retrieve the user's details for each visit. Cookies are used to enable the functionality of certain areas and make things easier for people visiting our website. Some of our affiliate and advertising partners may also use cookies.",
    ],
  },
  {
    id: "license",
    title: "License",
    body: [
      "Unless otherwise stated, Perfect Pearls and Pigments and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access material for your own personal use, subject to the restrictions set in these terms and conditions.",
      "You must not:",
      {
        list: [
          "Republish material from Perfect Pearls and Pigments",
          "Sell, rent or sub-license material from Perfect Pearls and Pigments",
          "Reproduce, duplicate or copy material from Perfect Pearls and Pigments",
          "Redistribute content from Perfect Pearls and Pigments",
        ],
      },
      "This agreement begins on the date hereof.",
    ],
  },
  {
    id: "comments",
    title: "Comments",
    body: [
      "Parts of this website offer users the opportunity to post and exchange opinions and information. We do not filter, edit, publish or review comments before they appear on the website, and comments do not reflect our views or opinions. To the extent permitted by applicable law, we shall not be liable for the comments or for any damages or expenses caused by their use, posting or appearance.",
      "We reserve the right to monitor all comments and remove any that can be considered inappropriate, offensive or in breach of these terms and conditions.",
      "You warrant and represent that:",
      {
        list: [
          "You are entitled to post the comments and have all necessary licenses and consents to do so",
          "The comments do not infringe any intellectual property right of any third party",
          "The comments do not contain defamatory, libellous, offensive, indecent or otherwise unlawful material",
          "The comments will not be used to solicit or promote business, commercial activity or unlawful activity",
        ],
      },
      "You hereby grant us a non-exclusive license to use, reproduce, edit and authorise others to use, reproduce and edit any of your comments in any form, format or media.",
    ],
  },
  {
    id: "hyperlinking",
    title: "Hyperlinking to our content",
    body: [
      "The following organisations may link to our website without prior written approval: government agencies, search engines, news organisations, online directory distributors, and system-wide accredited businesses (except soliciting non-profits, charity shopping malls and charity fundraising groups).",
      "These organisations may link to our home page, publications or other website information so long as the link (a) is not in any way deceptive, (b) does not falsely imply sponsorship, endorsement or approval, and (c) fits within the context of the linking party's site.",
      "We may consider and approve other link requests from commonly-known consumer or business information sources, community sites, associations, internet portals, accounting, law and consulting firms, and educational institutions and trade associations.",
      "If you are interested in linking to our website, please inform us by e-mail, including your name, organisation, contact information and the URLs involved. Allow 2–3 weeks for a response.",
      "No use of Perfect Pearls and Pigments' logo or other artwork is allowed for linking absent a trademark license agreement.",
    ],
  },
  {
    id: "iframes",
    title: "iFrames",
    body: [
      "Without prior approval and written permission, you may not create frames around our webpages that alter the visual presentation or appearance of our website in any way.",
    ],
  },
  {
    id: "content-liability",
    title: "Content liability",
    body: [
      "We shall not be held responsible for any content that appears on your website. You agree to protect and defend us against all claims arising on your website. No link should appear on any website that may be interpreted as libellous, obscene or criminal, or which infringes, violates, or advocates the infringement of any third-party rights.",
    ],
  },
  {
    id: "privacy",
    title: "Your privacy",
    body: [{ callout: "Please read our Privacy Policy for details of how we collect and use your data." }],
  },
  {
    id: "reservation",
    title: "Reservation of rights",
    body: [
      "We reserve the right to request that you remove all links or any particular link to our website, and you approve to immediately remove all links upon request. We also reserve the right to amend these terms and conditions and this linking policy at any time. By continuously linking to our website, you agree to be bound by and follow these linking terms and conditions.",
      "If you find any link on our website that is offensive for any reason, you are free to contact us at any moment. We will consider requests to remove links, but we are not obligated to do so or to respond directly.",
      "We do not warrant the completeness or accuracy of the information on this website, nor do we promise that the website remains available or that its material is kept up to date.",
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: [
      "To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and its use. Nothing in this disclaimer will:",
      {
        list: [
          "Limit or exclude our or your liability for death or personal injury",
          "Limit or exclude our or your liability for fraud or fraudulent misrepresentation",
          "Limit any of our or your liabilities in any way that is not permitted under applicable law",
          "Exclude any of our or your liabilities that may not be excluded under applicable law",
        ],
      },
      "The limitations and prohibitions of liability set in this section and elsewhere in this disclaimer govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.",
      "As long as the website and its information and services are provided free of charge, we will not be liable for any loss or damage of any nature.",
    ],
  },
];

export default async function TermsPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Legal"
        title="Terms & Conditions"
        intro="The rules and regulations for the use of Perfect Pearls and Pigments' website."
        updated="5 July 2024"
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
