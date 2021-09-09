import Head from "next/head";
import cookie from "cookie";
import Router from "next/router";
import moment from "moment";

const ViewArticle = (props: any) => {
  const description = props.response.content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
  return (
    <div className="flex flex-col items-center min-h-screen pt-3 md:pt-5">
      <Head>
        <title>FastPaper • {props.response.title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={props.response.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="" />
        <meta property="og:site_name" content="FastPaper" />
        <meta property="article:published_time" content={props.response.date} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={props.response.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="" />

        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_HOST + "/" + props.response.slug}
        />
      </Head>
      <div className="flex flex-col w-full h-auto px-2 sm:px-0 sm:w-4/5 lg:w-3/5">
        <h1 className="mt-4 my-2 text-center text-2xl lg:text-3xl font-bold uppercase text-blue-500">
          {props.response.title}
        </h1>
        <div
          className="py-8 text-lg"
          dangerouslySetInnerHTML={{ __html: props.response.content }}
        ></div>
        <h5 className="mt-4 my-2 text-base self-start text-gray-500 font-ligth">
          {moment(props.response.date).format("DD-MM-YYYY")}
        </h5>
        <h5 className="mt-4 my-2 text-base self-end text-gray-500 font-ligth italic">
          ~ {props.response.author}
        </h5>
        {props.response.editable && (
          <button
            className="w-56 mt-14 mb-5 text-lg font-bold bg-blue-600 p-3 self-center rounded text-white hover:shadow-lg"
            onClick={() => Router.push("/edit/" + props.name)}
          >
            GO TO EDIT
          </button>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  let cookies: any;
  if (!context.req.headers.cookie) {
    cookies = { session: "" };
  } else {
    cookies = cookie.parse(context.req.headers.cookie);
  }
  const { article_name } = context.query;
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_HOST + "/get/" + article_name,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + cookies.session,
        },
      }
    );
    const res = await req.json();
    if (!req.ok || !res.success)
      return { redirect: { destination: "/error", permanent: false } };
    return { props: { response: res.message, name: article_name } };
  } catch (err: any) {
    return { redirect: { destination: "/error", permanent: false } };
  }
};

export default ViewArticle;
