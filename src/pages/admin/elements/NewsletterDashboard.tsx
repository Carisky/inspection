// pages/admin/elements/NewsletterDashboard.tsx
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Newsletter from './Newsletter';
import EmailTemplateEditor from '../components/EmailTemplateEditor';
import MailingListsManager from '../components/MailingListsManager';
import NewsletterHistory from './NewsletterHistory';

const NewsletterDashboard: React.FC = () => {
  // Возможные вложенные вкладки: рассылка, редактор шаблонов, списки рассылки, история рассылок
  const [subTab, setSubTab] = useState<'send' | 'templateEditor' | 'mailingLists' | 'history'>('send');

  const handleSubTabChange = (
    event: React.SyntheticEvent,
    newValue: 'send' | 'templateEditor' | 'mailingLists' | 'history'
  ) => {
    setSubTab(newValue);
  };

  return (
    <Box>
      <Tabs value={subTab} onChange={handleSubTabChange}>
        <Tab label="Рассылка" value="send" />
        <Tab label="Редактор шаблонов" value="templateEditor" />
        <Tab label="Списки рассылки" value="mailingLists" />
        <Tab label="История рассылок" value="history" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {subTab === 'send' && <Newsletter />}
        {subTab === 'templateEditor' && <EmailTemplateEditor />}
        {subTab === 'mailingLists' && <MailingListsManager />}
        {subTab === 'history' && <NewsletterHistory />}
      </Box>
    </Box>
  );
};

export default NewsletterDashboard;
