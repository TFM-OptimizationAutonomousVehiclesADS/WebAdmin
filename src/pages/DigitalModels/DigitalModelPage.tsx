import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { DigitalModelsTable } from '@app/components/DigitalModels/List/DigitalModelsTable';
import {DigitalModelTemplate} from "@app/components/DigitalModels/DigitalModel/DigitalModelTemplate";
import { useParams } from 'react-router-dom'

const DigitalModelPage: React.FC = () => {
  const { t } = useTranslation();
  const { idDigitalModel } = useParams();

  return (
    <>
      <PageTitle>{t('dm.digital-model')}</PageTitle>
      <DigitalModelTemplate idDigitalModel={idDigitalModel}/>
    </>
  );
};

export default DigitalModelPage;
