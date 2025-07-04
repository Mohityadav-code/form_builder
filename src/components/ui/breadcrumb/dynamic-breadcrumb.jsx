import React from 'react'
import { Breadcrumb, BreadcrumbPage } from '../breadcrumb'
import { useBreadcrumb } from './breadcrumb-context'

function DynamicBreadcrumb() {
  const { breadcrumbData } = useBreadcrumb()
  const lastBreadcrumb = breadcrumbData[breadcrumbData.length - 1]

  return (
    <Breadcrumb>
      <BreadcrumbPage className="text-2xl font-semibold text-[#e36b14]">
        {lastBreadcrumb?.label}
      </BreadcrumbPage>
    </Breadcrumb>
  )
}

export default DynamicBreadcrumb
