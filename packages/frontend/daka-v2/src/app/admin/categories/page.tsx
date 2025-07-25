import {Suspense} from "react"
import {findCategories} from "./actions";
import {CategoriesPageContent} from "./content";
import {LoadingSkeleton} from "./skeleton";

interface SearchParams {
  page?: string
  pageSize?: string
  search?: string
}


async function CategoriesData({props}: { props: Promise<SearchParams> }) {
  const searchParams = await props
  const page = Number(searchParams?.page) || 1
  const pageSize = Number(searchParams?.pageSize) || 5
  const search = searchParams?.search || ""


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
