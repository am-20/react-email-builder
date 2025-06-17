import React from 'react';
import { Type, FileText, Image, Layout, Columns, Grid } from 'lucide-react';

// Initial email template structure
export const initialTemplate = {
  id: `template-${Date.now()}`,
  title: 'Untitled Email Template',
  titleLinkLabel: '',
  blocks: [
    {
      id: 'header-1',
      type: 'header',
      content: 'Welcome to our Newsletter',
      settings: {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontSize: '48px',
        padding: '24px 0',
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
        padding: '24px 0',
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
        canvascolor: '#FFFFFF',
        textcolor: '#000000',
        theme: 'day',
        disclaimercolor: '#555555',
        linklabel: '99_unsubscribe_btn',
        urls: {
          facebook: 'https://www.facebook.com/SamsungKazakhstan',
          instagram: 'https://www.instagram.com/samsungkz/',
          vkontakte: 'https://vk.com/samsungkazakhstan',
          youtube: 'https://www.youtube.com/user/SamsungKZ',
          twitter: 'https://twitter.com/SamsungKZ',
          linkedin: 'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
          livechat: 'https://www.samsung.com/kz_ru/support/?content_type=text&creative=creative&segment=no-segment',
          email: 'https://www.samsung.com/kz_ru/support/email/?content_type=text&creative=creative&segment=no-segment',
          hotline: 'https://www.samsung.com/kz_ru/info/contactus/?content_type=text&creative=creative&segment=no-segment',
          call: 'tel:7700',
          optout: 'https://www.samsung.com/kz_ru/unsubscribe',
          privacy: 'https://www.samsung.com/kz_ru/info/privacy/?content_type=text&creative=creative&segment=no-segment',
          legal: 'https://www.samsung.com/kz_ru/info/legal/?content_type=text&creative=creative&segment=no-segment'
        }
      }
    }
  ],
};

// Available components to add
export const components = [
  { type: 'header', label: 'Heading', icon: <Type size={16} /> },
  { type: 'text', label: 'Text Block', icon: <FileText size={16} /> },
  { type: 'image', label: 'Image', icon: <Image size={16} /> },
  { type: 'button', label: 'Button', icon: <Layout size={16} /> },
  { type: 'buttonGroup', label: 'Button Group', icon: <Layout size={16} /> },
  { type: 'divider', label: 'Divider', icon: <Columns size={16} /> },
  { type: 'spacer', label: 'Spacer', icon: <Layout size={16} /> },
  { type: 'columns', label: '2 Columns', icon: <Grid size={16} /> },
  { type: 'halfText', label: 'Half Text', icon: <FileText size={16} /> },
  { type: 'footer', label: 'General Footer RU', icon: <Layout size={16} /> },
]; 