import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const pickupDatetime = searchParams.get('pickup_datetime');
    const dropoffDatetime = searchParams.get('dropoff_datetime');
    const minFareAmount = searchParams.get('min_fare_amount');
    const maxFareAmount = searchParams.get('max_fare_amount');
    const minTripDistance = searchParams.get('min_trip_distance');
    const maxTripDistance = searchParams.get('max_trip_distance');
    const paymentType = searchParams.get('payment_type');

    const filters = [];

    if (pickupDatetime) filters.push(`pickup_datetime >= '${pickupDatetime}'`);
    if (dropoffDatetime)
      filters.push(`pickup_datetime <= '${dropoffDatetime}'`);
    if (minFareAmount) filters.push(`fare_amount >= ${minFareAmount}`);
    if (maxFareAmount) filters.push(`fare_amount >= ${maxFareAmount}`);
    if (minTripDistance) filters.push(`trip_distance >= ${minTripDistance}`);
    if (maxTripDistance) filters.push(`trip_distance <= ${maxTripDistance}`);
    if (paymentType) filters.push(`payment_type = '${paymentType}'`);

    const whereClause = filters.length ? `$where=${filters.join(' AND ')}` : '';
    const url = `${process.env.NEXT_PUBLIC_NYC_OPEN_DATA_BASE_URL}/resource/gkne-dk5s.json?${whereClause}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.error)
      return NextResponse.json(
        {
          error: true,
          message: 'failed to retrieve 2014 yellow taxi trip data',
        },
        { status: 400 },
      );

    return NextResponse.json(
      {
        error: false,
        message: '2014 yellow taxi trip data has been successfully retrieved',
        data: responseJson,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: 'internal server error. please, contact the developer',
    });
  }
}
