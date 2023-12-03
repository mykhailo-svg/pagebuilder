import { Progress, Tone } from '@shopify/polaris/build/ts/src/components/Badge';
import { PagePublishStatus } from '~/global_types';

export const definePageBadgesStatus = (status: PagePublishStatus) => {
  let initialObject: { tone: Tone; progress: Progress; text: string } = {
    tone: 'critical',
    progress: 'incomplete',
    text: 'Never published',
  };
  if (status === 'notPublished') {
    initialObject.tone = 'attention';
    initialObject.progress = 'partiallyComplete';
    initialObject.text = 'Not published';
  } else if (status === 'published') {
    initialObject.tone = 'success';
    initialObject.progress = 'complete';
    initialObject.text = 'Published';
  }
  return initialObject;
};
