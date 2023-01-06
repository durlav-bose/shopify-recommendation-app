import { useState, useCallback, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  FormLayout,
  DataTable,
  Thumbnail,
  Spinner,
  Tag,
  MediaCard,
  Grid,
  Page,
  Layout,
  Toast,
  Frame, Modal, TextContainer, ResourceList, Avatar, ResourceItem
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

import { ResourcePicker, unstable_Picker as Picker } from "@shopify/app-bridge-react";
import SkeletonExample from "./SkeletonPage";

import {useAppBridge} from '@shopify/app-bridge-react';
import {Fullscreen} from '@shopify/app-bridge/actions';

export function ProductsCard() {
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [showSimilarResourcePicker, setShowSimilarResourcePicker] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [arr, setarr] = useState([]);
  const [product, setproduct] = useState([]);
  const [message, setmessage] = useState("No products available");
  const [productMong, setProductMong] = useState([]);
  const [tag, setTag] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);
  const [change, setChange] = useState(false);
  const [changeDelete, setChangeDelete] = useState(false);
  const [allProductsShopify, setAllProductsShopify] = useState([]);
  const toggleActive = useCallback(() => setActive(false), []);
  const [graphQuery, setGraphQuery] = useState([]);
  const [showItem, setShowItem] = useState([]);
  const app = useAppBridge();
  const fullscreen = Fullscreen.create(app);

  useEffect(async () => {
    const response = await fetch("/api/products/show")
      .then((response) => response.json())
      .then((data) => {
        console.log("all products data from mongodb............... :>> ", data);
        if(data.prodArray && data.productQuery) {
          setProductMong(data.prodArray);
          setGraphQuery(data.productQuery);
        }
      }).catch(error => {
        console.log('error :>> ', error);
      });
    const allProductsList = await fetch("/api/products/all")
      .then(response => response.json())
      .then((data, index) => {
        console.log('data all products..... ', data);
        setAllProductsShopify(data);
      })
      .catch((error) => console.log('error >> ', error))
  }, []);

  const getProduct = useCallback(async() => {
    const response = await fetch("/api/products/show")
      .then((response) => response.json())
      .then((data) => {
        console.log("all products data............... :>> ", data);
        if(data.prodArray && data.productQuery) {
          setProductMong(data.prodArray);
          setGraphQuery(data.productQuery);
        }
        setChange(false);
        setChangeDelete(false);
      }).catch(error => {
        console.log('error :>> ', error);
      });
    const allProductsList = await fetch("/api/products/all")
    .then(response => response.json())
    .then((data, index) => {
      setAllProductsShopify(data);
    })
    .catch((error) => console.log('error >> ', error))
  },[change, changeDelete])

  const toggleResourcePicker = useCallback(() => {
    setShowResourcePicker(false);
    console.log(
      "showResourcePicker.............toggleResourcePicker..........",
      showResourcePicker
    );
  }, [showResourcePicker]);


  const selectResourcePicker = useCallback(() => {
    setShowResourcePicker(true);
  }, [showResourcePicker]);

  const handleProductChange = useCallback((products) => {
    console.log('products.................. :>> ', products);
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

  const deleteTaggedProduct = async (product) => {
    // Call the `ENTER` action to put the app in full-screen mode
    fullscreen.dispatch(Fullscreen.Action.ENTER);
    // try {
    //   console.log('product..... :>> ', product);
    //   let obj = {
    //     id: product.product_id
    //   }
    //   const response = await fetch("/api/products/delete", {
    //     method: "DELETE",
    //     body: JSON.stringify(obj),
    //     headers: { 'Content-type': 'application/json' },
    //   })
    //   if(response.ok) {
    //     setActive(true);
    //     setChangeDelete(true);
    //     await getProduct();
    //     setSuccess("Product deleted successfully");
    //   } else {
    //     setActive(true);
    //     setError("Record doesn't exist or already deleted");
    //   }
    // } catch (error) {
    //   console.log('error :>> ', error);
    // }
  };

  const toastMarkupSuccess = active ? (
    <Toast content={success} onDismiss={toggleActive} duration={4500}/>
  ) : null;

  const toastMarkupError = active ? (
    <Toast content={error} error onDismiss={toggleActive} duration={4500}/>
  ) : null;

  const updateProductList = async () => {
    setIsLoading(true);
    console.log('arr :>> ', arr);
    console.log('product :>> ', product);
    if (arr.length) {
      let r = Math.random().toString(36).substring(2, 10);
      for (let i = 0; i < arr.length; i++) {
        try {
          console.log(`working ${i}`);
          let obj = {
            tag: r,
            id: arr[i],
          };
          const response = await fetch("/api/products/update", {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" },
          });

          console.log("response...................... :>> ", response);
        } catch (error) {
          console.log("error :>> ", error);
        }
      }
      setarr([]);
      await getProduct();
    } else {
      return;
    }
    setIsLoading(false);
    setproduct([]);
    setmessage("Product tag is successfully added");
    setShowResourcePicker(false);
  };

  const [unstable, setUnstable] = useState(false);

  const similarProductResourcePicker = useCallback((products) => {
    // Call the `EXIT` action to take the app out of full-screen mode
    fullscreen.dispatch(Fullscreen.Action.EXIT);
    // let currTag = '';
    // for(let i = 0; i< products.length; i++) {
    //   currTag = products[i].product_tags;
    //   break;
    // }
    // setTag(currTag);
    // let arr = [];
    // console.log('allProductsShopify.......................... :>> ', allProductsShopify);
    // allProductsShopify.forEach((item,index) => {
    //   if(!graphQuery.includes(item.admin_graphql_api_id)) {
    //     console.log('item.admin_graphql_api_id :>> ', item.admin_graphql_api_id);
    //     arr.push(item)
    //   }
    // })
    // console.log('arr :>> ', arr);
    // setShowItem(arr);
    // setUnstable(true);
  }, []);

  const onCancelUnstable = () => {
    setSelectedItems([]);
    setUnstable(false);
  }

  const [actives, setActives] = useState(true);

  const handleChange = useCallback(() => setActives(!actives), [actives]);

  // const handleScrollBottom = useCallback(() => alert('Scrolled to bottom'), []);

  const activator = <Button onClick={handleChange}>Open</Button>;

  const [selectedItems, setSelectedItems] = useState([]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const promotedBulkActions = [
    {
      content: 'Add products',
      onAction: async() => {
        console.log('selectedItems :>> ', selectedItems);
        const allProductsList = await fetch("/api/products/all")
          .then(response => response.json())
          .then(async (data, index) => {
            data.forEach(async (item, ind) => {
              if(selectedItems.includes(item.id)) {
                try {
                    let obj = {
                      id: item.id,
                      tag: tag
                    }
                    const response = await fetch("/api/products/update", {
                      method: "PUT",
                      body: JSON.stringify(obj),
                      headers: { "Content-Type": "application/json" },
                    });
                    if(response.ok) {
                      setActive(true);
                      setChange(true);
                      await getProduct();
                      setSuccess("Product added successfully");
                    }
                } catch (error) {
                  console.log('error :>> ', error);
                } finally {
                  // await getProduct();
                }
              }
            });
            await getProduct();
            setUnstable(false);
          })
          .catch((error) => console.log('error >> ', error))
      },
    },
  ];

  function renderItem(item) {
    const {id, image, title} = item;
    const media = <Avatar customer size="medium" name={title} source={image.src}/>;

    return (
      <ResourceItem
        id={id}
        url={image.src}
        media={media}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3 fontWeight="bold">
          {title}
        </h3>
        {/* <div>{location}</div> */}
      </ResourceItem>
    );
  }

  return (
    <div>
      {
        unstable ? 
        <div style={{height: '500px'}}>
          <Modal
            activator={activator}
            open={actives}
            title="Add More Products"
            onClose={onCancelUnstable}
            // onScrolledToBottom={handleScrollBottom}
          >
              <Modal.Section>
                <Card>
                  <ResourceList
                    resourceName={resourceName}
                    items={showItem}
                    renderItem={renderItem}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    promotedBulkActions={promotedBulkActions}
                    // bulkActions={bulkActions}
                  />
                </Card>
              </Modal.Section>
            
          </Modal>
        </div> : ""
      }
      {productMong.length > 0 ? (
        <Grid>
          {productMong.map((product, index) => {
            return (
              <Grid.Cell
                columnSpan={{ xs: 3, sm: 3, md: 3, lg: 6, xl: 4 }}
                key={index}
              >
                <Card title="similar set of products" sectioned>
                  {product.length
                    ? product.map((prod, i) => {
                        return (
                          <MediaCard
                            title={prod.product_title}
                            primaryAction={{
                              content: "Delete Product",
                              onAction: () => {
                                deleteTaggedProduct(prod);
                              },
                            }}
                            key={i}
                            description={prod.product_handle}
                            popoverActions={[
                              { content: "Dismiss", onAction: () => {} },
                            ]}
                          >
                            <img
                              alt=""
                              width="100%"
                              height="100%"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                              src={prod.product_image}
                              // key={i}
                            />
                          </MediaCard>
                        );
                      })
                    : "No products available for this tag"}
                  <div style={{ marginTop: "20px" }}>
                    <Button primary onClick={() => similarProductResourcePicker(product)}>
                      Add more products in this set
                    </Button>
                  </div>
                </Card>
              </Grid.Cell>
            );
          })}
        </Grid>
      ) : (
        <Card>
          <SkeletonExample />
        </Card>
      )}
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
      <Card sectioned>
        <Form
          // onSubmit={() => updateProductList(newTag)}
          onSubmit={() => updateProductList()}
        >
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
            message
          )}

          {product.length > 0 ? (
            <FormLayout>
              {isLoading === true ? (
                <Spinner
                  accessibilityLabel="Small spinner example"
                  size="small"
                />
              ) : (
                <Button submit>Save</Button>
              )}
            </FormLayout>
          ) : (
            ""
          )}
        </Form>
      </Card>
      {
        active && success ? (
          <Frame>
            {toastMarkupSuccess}
          </Frame>
        ) : error? 
        <Frame>
          {toastMarkupError}
        </Frame> : ""
      }
    </div>
  );
}