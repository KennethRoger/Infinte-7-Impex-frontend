export interface DeskPhone {
  label: string;
  number: string;
  href: string;
}

export interface OfficeAddress {
  label: string;
  line1: string;
  line2: string;
}

export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
}

export interface ContactData {
  title: string;
  phones: DeskPhone[];
  workingHours: string;
  email: {
    label: string;
    address: string;
    href: string;
    note: string;
  };
  offices: OfficeAddress[];
  socials: SocialLinks;
}

export const CONTACT_INFO: ContactData = {
  title: 'Our Contacts',
  phones: [
    {
      label: 'India Desk',
      number: '+91 89074 70541',
      href: 'tel:+918907470541',
    },
    {
      label: 'UK Desk',
      number: '+44 7442 778992',
      href: 'tel:+447442778992',
    },
  ],
  workingHours: 'Mon-Sat, 9am - 7pm IST / GMT',
  email: {
    label: 'Email',
    address: 'infinite7impex@gmail.com',
    href: 'mailto:infinite7impex@gmail.com',
    note: 'response within 24 hours',
  },
  offices: [
    {
      label: 'India Office',
      line1: 'Building 20/1430, 2nd Milestone,',
      line2: 'Kollam - 691004, Kerala, India.',
    },
    {
      label: 'UK Office',
      line1: '75 Purser Road, Northampton,',
      line2: 'NN1 4PG, United Kingdom.',
    },
  ],
  socials: {
    linkedin: 'https://www.linkedin.com/in/infinite7impex/',
    instagram: 'https://www.instagram.com/infinite7impex/',
    facebook: 'https://www.facebook.com/profile.php?id=61594447148031',
  },
};
