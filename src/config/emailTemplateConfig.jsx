import React from 'react';
import {
  Type,
  FileText,
  Image,
  Layout,
  Columns,
  Grid,
  SquareCode,
  SquareRoundCorner,
} from 'lucide-react';

// Initial email template structure
export const initialTemplate = {
  id: `template-${Date.now()}`,
  title: 'Untitled Email Template',
  titleLinkLabel: '',
  titleLinkLabelUnsub: '',
  footerLinkLabel: '',
  blocks: [
    {
      id: 'header-1',
      type: 'header',
      content: 'Welcome to our Newsletter',
      settings: {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontSize: '48px',
        padding: '0',
        textAlign: 'center',
        fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
      },
    },
    {
      id: 'text-1',
      type: 'text',
      content:
        'Thank you for subscribing to our newsletter. We are excited to share the latest updates with you.',
      settings: {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontSize: '24px',
        padding: '0',
        textAlign: 'center',
        fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
      },
    },
    {
      id: 'image-1',
      type: 'image',
      content: 'https://placehold.co/640x300',
      settings: {
        backgroundColor: '#ffffff',
        textAlign: 'center',
        altText: 'Featured image',
        linkUrl: '',
        linkLabel: '',
      },
    },
    {
      id: 'footer-1',
      type: 'footer',
      settings: {
        canvascolor: '#f5f5f5',
        textcolor: '#000000',
        theme: 'day',
        disclaimercolor: '#555555',
        linklabel: '',
        urls: {
          facebook: 'https://www.facebook.com/SamsungKazakhstan',
          instagram: 'https://www.instagram.com/samsungkz/',
          vkontakte: 'https://vk.com/samsungkazakhstan',
          youtube: 'https://www.youtube.com/user/SamsungKZ',
          twitter: 'https://twitter.com/SamsungKZ',
          linkedin:
            'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
          livechat: 'https://www.samsung.com/kz_ru/support/',
          call: 'https://www.samsung.com/kz_ru/support/contact/#onlinesupport',
          optout:
            '<%@ include option="NmsServer_URL" %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_ru',
          privacy: 'https://www.samsung.com/kz_ru/info/privacy/',
          legal: 'https://www.samsung.com/kz_ru/info/legal/',
        },
      },
    },
  ],
};

// Available components to add
export const components = [
  { type: 'header', label: 'Heading', icon: <Type size={16} /> },
  { type: 'text', label: 'Text Block', icon: <FileText size={16} /> },
  { type: 'image', label: 'Image', icon: <Image size={16} /> },
  { type: 'button', label: 'Button', icon: <Layout size={16} /> },
  {
    type: 'buttonCoded',
    label: 'Button Coded',
    icon: <SquareCode size={16} />,
  },
  { type: 'buttonGroup', label: 'Button Group', icon: <Layout size={16} /> },
  {
    type: 'buttonCodedGroup',
    label: 'Button Coded Group',
    icon: <SquareCode size={16} />,
  },
  { type: 'divider', label: 'Divider', icon: <Columns size={16} /> },
  { type: 'spacer', label: 'Spacer', icon: <Layout size={16} /> },
  { type: 'columns', label: 'Img Columns', icon: <Grid size={16} /> },
  {
    type: 'columnsContent',
    label: 'Content Columns',
    icon: <Grid size={16} />,
  },
  { type: 'halfText', label: 'Half Text', icon: <FileText size={16} /> },
  {
    type: 'roundContainer',
    label: 'Round Container',
    icon: <SquareRoundCorner size={16} />,
  },
  { type: 'footer', label: 'General Footer RU', icon: <Layout size={16} /> },
  {
    type: 'footer_general_kz',
    label: 'Footer General KZ',
    icon: <Layout size={16} />,
  },
  {
    type: 'footer_sendpulse',
    label: 'Footer Sendpulse',
    icon: <Layout size={16} />,
  },
];
