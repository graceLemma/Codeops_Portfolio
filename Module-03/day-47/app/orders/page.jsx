const orders = await getOrdersFor(session.id, {
  sort: searchParams.sort ?? "date",
  dir: searchParams.dir ?? "desc"
});

const page = Number(searchParams.page ?? 1);
const { rows, total } = await getOrdersFor(session.id, {
  skip: (page - 1) * 20,
  take: 20
});

<Pager page={page} pages={Math.ceil(total / 20)} />