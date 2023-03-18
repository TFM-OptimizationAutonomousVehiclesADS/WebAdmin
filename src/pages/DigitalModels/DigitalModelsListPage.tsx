import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { DigitalModelsTable } from '@app/components/DigitalModels/List/DigitalModelsTable';

const DigitalModelsListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('dm.digital-models')}</PageTitle>
      <DigitalModelsTable />
    </>
  );
};

export default DigitalModelsListPage;
