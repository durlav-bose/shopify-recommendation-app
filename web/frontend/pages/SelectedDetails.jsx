import { Card, Page, Layout, TextContainer, Heading, Button, DataTable, Thumbnail } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";

export default function SelectedDetails() {

  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [product, setproduct] = useState([]);
  const [message, setmessage] = useState("No products available");
  const [arr, setarr] = useState([]);

  const handleProductChange = useCallback((products) => {
    for (let i = 0; i < products.selection.length; i++) {
      let result = products.selection[i].id.slice(
        products.selection[i].id.length - 13,
        products.selection[i].id.length
      );
      setarr((searches) => [...searches, result]);
      setproduct((searches) => [...searches, products.selection[i]]);
    }
    setShowResourcePicker(false);
  });

  const toggleResourcePicker = useCallback(() => {
    setShowResourcePicker(false);
  }, [showResourcePicker]);

  const selectResourcePicker = useCallback(() => {
    setShowResourcePicker(true);
  }, [showResourcePicker]);

  return (
    <Page 
      title="Selected Tag"
      fullWidth
      breadcrumbs={[{content: 'Home Page', url: '/'}]}
    >
      <Layout>
        <Layout.Section>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Card title="Product Counter" sectioned>
              {showResourcePicker && (
                <ResourcePicker
                  resourceType="Product"
                  showVariants={false}
                  selectMultiple={true}
                  onCancel={toggleResourcePicker}
                  onSelection={handleProductChange}
                  open
                />
              )}
              <Button onClick={() => selectResourcePicker()}>Add a unique set of products</Button>
            </Card>
          </div>

          {product.length > 0 ? (
          <DataTable
            columnContentTypes={["text", "text"]}
            headings={["Title", "Image"]}
            rows={product.map((item) => {
              const image = (
                <Thumbnail
                  key="{item}"
                  source={`${item.images[0].originalSrc}`}
                  alt="Black choker necklace"
                />
              );
              return [[item.title], [image]];
            })}
          />
        ) : (
          
          <Card title="Available Products" sectioned>
            {message}
          </Card>
        )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
