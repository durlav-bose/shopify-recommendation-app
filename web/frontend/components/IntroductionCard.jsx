import React, { useState, useCallback, useEffect } from "react";
import {Card, EmptyState} from '@shopify/polaris';
import { useAuthenticatedFetch } from "../hooks";
import { ResourcePicker, unstable_Picker as Picker } from "@shopify/app-bridge-react";
import SkeletonExample from "./SkeletonPage";
import {useAppBridge} from '@shopify/app-bridge-react';
import {Fullscreen} from '@shopify/app-bridge/actions';
import { useNavigate } from "react-router-dom";

export function IntroductionCard({ state, setState }) {

  let navigate = useNavigate(); 

  return (
    <Card sectioned>
      <EmptyState
        heading="Manage your product recommendation"
        action={{content: 'Create a tag', onAction: () => {
          console.log("working...");
          setState(true);
        }}}
        secondaryAction={{
          content: 'Learn more',
          onAction: () => {
            let path = `Rules`; 
            navigate(path);
          }
        }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>Tristique natoque ipsam, vestibulum. Architecto faucibus, saepe sequi tincidunt. Vulputate proident dignissim, a sint nulla? Aptent? Fringilla! Voluptatem interdum lectus, elementum, vero! Lorem quibusdam harum ipsam sequi, pellentesque quasi nesciunt, distinctio, consequuntur voluptatibus incididunt ipsum ratione, placeat error beatae quod! Aliquet corrupti metus tempore! Aliquid velit praesentium voluptatem quos venenatis.</p>
      </EmptyState>
    </Card>
  )
}