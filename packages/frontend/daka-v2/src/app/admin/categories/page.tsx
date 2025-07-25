import {Suspense} from "react"
import {findCategories} from "./actions";
import {CategoriesPageContent} from "./content";
import {LoadingSkeleton} from "./skeleton";

interface SearchParams {
  page?: string
  pageSize?: string
  search?: string
}


type Props = Promise<SearchParams>

// Separate component for categories data that can be suspended
async function CategoriesData({props}: { props: Promise<SearchParams> }) {
  const searchParams = await props
  const page = Number(searchParams?.page) || 1
  const pageSize = Number(searchParams?.pageSize) || 5
  const search = searchParams?.search || ""

  // Simulate loading time to demonstrate suspense
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Fetch data directly in server component
  const {categories, total} = await findCategories({
    search,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    tenantId: "default",
  })

  const pagination = {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }

  return <CategoriesPageContent initialCategories={categories} initialPagination={pagination} initialSearch={search}/>
}

export default function Page({
                               searchParams,
                             }: {
  searchParams: Promise<SearchParams>
}) {

  return (
      <Suspense fallback={<LoadingSkeleton rows={5}/>}>
        <CategoriesData props={searchParams}/>
      </Suspense>
  )
}
