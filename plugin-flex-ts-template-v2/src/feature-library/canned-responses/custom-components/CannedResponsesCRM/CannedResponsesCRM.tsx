import React, { useState, useEffect } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/text';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Column, Grid } from '@twilio-paste/core/grid';
import { Stack } from '@twilio-paste/stack';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Template, templates } from '@twilio/flex-ui';
import { Input } from '@twilio-paste/core/input';

import { CannedResponseCategories, ResponseCategory } from '../../types/CannedResponses';
import Category from './Category';
import CannedResponsesService from '../../utils/CannedResponsesService';
import { StringTemplates } from '../../flex-hooks/strings';

const CannedResponsesCRM: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [responseCategories, setResponseCategories] = useState<undefined | CannedResponseCategories>(undefined);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function getResponses() {
      try {
        const responses = await CannedResponsesService.fetchCannedResponses();
        setResponseCategories(responses.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    }

    getResponses();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredCategories = responseCategories?.categories.filter((category) =>
    category.responses.some((response) => response.text.toLowerCase().includes(searchText.toLowerCase())),
  );

  return (
    <Box as="div" padding="space50">
      <Stack orientation="horizontal" spacing="space30">
        <ChatIcon decorative />
        <Text as="h1" fontSize="fontSize60" fontWeight="fontWeightSemibold" marginBottom="space40" marginTop="space30">
          <Template source={templates[StringTemplates.CannedResponses]} />
        </Text>
      </Stack>
      <Input type="text" placeholder="Search responses..." value={searchText} onChange={handleSearchChange} />
      {isLoading && <SkeletonLoader />}
      {Boolean(filteredCategories) && !isLoading && (
        <>
          {filteredCategories?.map((category: ResponseCategory) => (
            <Grid gutter="space30" vertical key={category.section}>
              <Column>
                <Category {...category} />
              </Column>
            </Grid>
          ))}
        </>
      )}
      {error && (
        <Text as="p">
          <Template source={templates[StringTemplates.ErrorFetching]} />
        </Text>
      )}
    </Box>
  );
};

export default CannedResponsesCRM;
