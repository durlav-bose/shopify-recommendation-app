import React, { useState, useCallback, useEffect } from "react";
import { Card, EmptyState, Page } from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";


export default function Rules() {
  return (
    <Page
      breadcrumbs={[{content: 'Home Page', url: '/'}]}
      title="General"
      divider
      fullWidth
    >
      <TitleBar title="Rules" primaryAction={null} />
      <Card title="Rules" sectioned>
        <p>
          Mus nunc cras quia eget animi posuere pretium aliquid voluptatem vitae? Distinctio phasellus facere interdum semper, scelerisque. Ornare? Nesciunt porro, fugit corporis quae expedita? Venenatis ante ullam sem. Conubia aptent earum autem! Recusandae nisi nisi amet sodales odio saepe blanditiis. Mus ab magna eiusmod, id, numquam hic temporibus quas platea.
        </p>
        <p>
          Posuere veniam ratione aliquet sodales. Voluptatibus parturient? Error sit repellendus ducimus aliquip! Blandit purus facilis vitae aliquam voluptates aliquam tenetur fugit minus parturient esse. Nobis similique facilis eveniet, per maxime? Blanditiis, quod, egestas repudiandae? Nonummy, illum adipisci lobortis vero laborum, magnis debitis impedit habitasse per repellendus curae justo. Consequat, dolore.
        </p>
      </Card>
    </Page>
  )
}