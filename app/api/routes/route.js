import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const pickupDatetime = searchParams.get('pickup_datetime');
  const dropoffDatetime = searchParams.get('dropoff_datetime');
  const minTripDistance = searchParams.get('min_trip_distance');
  const maxTripDistance = searchParams.get('max_trip_distance');
  const paymentType = searchParams.get('payment_type');

  const filters = [];

  if (pickupDatetime) filters.push(`pickup_datetime >= '${pickupDatetime}'`);
  if (dropoffDatetime) filters.push(`pickup_datetime <= '${dropoffDatetime}'`);
  if (minTripDistance) filters.push(`trip_distance >= ${minTripDistance}`);
  if (maxTripDistance) filters.push(`trip_distance <= ${maxTripDistance}`);
  if (paymentType) filters.push(`payment_type ='${paymentType}'`);

  const whereClause = filters.length ? `$where=${filters.join(' AND ')}` : '';
  const selectClause = `$select=pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude`;
  const url = `${process.env.NEXT_PUBLIC_NYC_OPEN_DATA_BASE_URL}/resource/gkne-dk5s.json?${selectClause}&${whereClause}`;

  const response = await fetch(url);
  const responseJson = await response.json();

  if (responseJson.error)
    return NextResponse.json(
      {
        error: true,
        message: 'failed to retrieve route data',
      },
      { status: 400 },
    );

  const routes = responseJson.map((trip) => ({
    pickup: {
      longitude: parseFloat(trip.pickup_longitude),
      latitude: parseFloat(trip.pickup_latitude),
    },
    dropoff: {
      longitude: parseFloat(trip.dropoff_longitude),
      latitude: parseFloat(trip.dropoff_latitude),
    },
  }));

  return NextResponse.json(
    {
      error: false,
      message: 'route has been successfully retrieved',
      data: routes,
    },
    { status: 200 },
  );
}
