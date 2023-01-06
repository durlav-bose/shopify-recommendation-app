import {
  Card,
  Page,
  Layout,
  TextContainer,
  Form, FormLayout, Checkbox, TextField, Button,
  Modal
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { trophyImage } from "../assets";
import { ProductsCard, IntroductionCard, ProductTable } from "../components";
import { useState, useCallback } from "react";

export default function HomePage() {
  const [showPicker, setShowPicker] = useState(false);
  const [productsAdded, setProductsAdded] = useState(false);
  const closeModal = useCallback(() => setShowPicker(!showPicker), [showPicker]);

  // Form input
  const [tag, setTag] = useState([]);
  const [singleTag, setSingleTag] = useState("");

  const handleSubmit = useCallback((event) => {
    console.log('singleTag :>> ', singleTag);
    setTag(old => [...old, singleTag]);
    console.log('tag :>> ', tag);
    setSingleTag("");
    setProductsAdded(true);
    setShowPicker(false);
  }, [singleTag]);

  const handleInputChange = useCallback((value) => {
    console.log('value :>> ', value);
    setSingleTag(value);
  });

  return (
    <Page
      title="Home Page"
      fullWidth
      primaryAction={{
        content: "Create Tag",
        onAction: () => {
          setShowPicker(true);
        },
      }}
    >
      <Layout>
        <Layout.Section>
          {/* <ProductsCard /> */}
          {
            productsAdded ? <ProductTable Tags={tag}/> : <IntroductionCard state={showPicker} setState={setShowPicker} />
          }
          {showPicker ? (
            <Modal
              open={showPicker}
              onClose={closeModal}
              title="Reach more shoppers with Instagram product tags"
            >
              <Modal.Section>
                <Form onSubmit={handleSubmit}>
                  <FormLayout>
                    <TextField
                      value={singleTag}
                      onChange={handleInputChange}
                      label="Enter a tag name"
                      type="text"
                      helpText={
                        <span>
                          Please enter a tag name
                        </span>
                      }
                    />
                    <Button submit>Submit</Button>
                  </FormLayout>
                </Form>
              </Modal.Section>
            </Modal>
          ) : (
            ""
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
