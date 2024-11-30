import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const pickupDatetime = searchParams.get('pickup_datetime');
    const dropoffDatetime = searchParams.get('dropoff_datetime');
    const paymentType = searchParams.get('payment_type');

    const filters = [];

    if (pickupDatetime) filters.push(`pickup_datetime >= '${pickupDatetime}'`);
    if (dropoffDatetime)
      filters.push(`pickup_datetime <= '${dropoffDatetime}'`);
    if (paymentType) filters.push(`payment_type = '${paymentType}'`);

    const whereClause = filters.length ? `$where=${filters.join(' AND ')}` : '';
    const queries = {
      fareDistribution: `$select=floor(fare_amount/5)*5 as fare_range,count(*) as trip_count ${whereClause} group by fare_range order by fare_range`,
      tripCountsByHour: `$select=hour(pickup_datetime) as hour,count(*) as trip_count ${whereClause} group by hour order by hour`,
      avgTripDistance: `$select=payment_type,avg(trip_distance) as avg_distance ${whereClause} group by payment_type`,
    };

    const responses = await Promise.all(
      Object.entries(queries).map(async ([key, query]) => {
        const url = `${process.env.NEXT_PUBLIC_NYC_OPEN_DATA_BASE_URL}/resource/gkne-dk5s.json?${query}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        return { [key]: responseJson };
      }),
    );

    const aggregations = responses.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {},
    );

    return NextResponse.json({
      error: false,
      message: 'aggregrated data has been successfully retrieved',
      data: aggregations,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: 'internal server error. please, contact the developer',
    });
  }
}
