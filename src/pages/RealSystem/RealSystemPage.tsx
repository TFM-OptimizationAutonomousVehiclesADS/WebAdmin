import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { DigitalModelsTable } from '@app/components/DigitalModels/List/DigitalModelsTable';
import {DigitalModelTemplate} from "@app/components/DigitalModels/DigitalModel/DigitalModelTemplate";
import { useParams } from 'react-router-dom'
import { RealSystemTemplate } from "@app/components/DigitalModels/RealSystem/RealSystemTemplate";

const RealSystemPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('dm.real-system')}</PageTitle>
      <RealSystemTemplate/>
    </>
  );
};

export default RealSystemPage;
