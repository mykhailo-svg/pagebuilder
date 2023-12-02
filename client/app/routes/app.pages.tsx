import {
  LegacyCard,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
} from '@shopify/polaris';

export default function Pages() {
  return (
    <LegacyCard>
      <ResourceList
        resourceName={{ singular: 'customer', plural: 'customers' }}
        items={[
          {
            id: '100',
            url: '#',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
          },
          {
            id: '200',
            url: '#',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
          },
        ]}
        renderItem={(item) => {
          const { id, url, name, location } = item;
          const media = <Avatar customer size="md" name={name} />;

          return (
            <ResourceItem
              id={id}
              url={url}
              media={media}
              accessibilityLabel={`View details for ${name}`}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {name}
              </Text>
              <div>{location}</div>
            </ResourceItem>
          );
        }}
      />
    </LegacyCard>
  );
}
