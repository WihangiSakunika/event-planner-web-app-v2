import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, Group, Image, Text, Textarea} from '@mantine/core';
import Loading from "../../components/Loading.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../state/store.ts";
import {getEvent} from "../../state/event/eventSlice.ts";
import moment from "moment";
import CategoryTags from "../../components/CategoryTags.tsx";
import NoData from "../../components/NoData.tsx";
import ShareMenu from "../../components/ShareMenu.tsx";
import {LOGGED_IN_USER_ID} from "../../constants/constants.ts";

const EventDetails = () => {
    const {id} = useParams<{ id: string }>(); // Get the event ID from the URL
    const loggedInUserId = localStorage?.getItem(LOGGED_IN_USER_ID); // Get the event ID from the URL
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch | any>();
    const event: any = useSelector((state: RootState) => state.event.event);
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);// Find the event by ID

    useEffect(() => {
        (async () => {
            setLoading(true);
            await dispatch(getEvent({_id: id}));
            setUrl(`https://event-planner-qa.vercel.app/invitation/${id}`);
            setLoading(false);
        })();
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            alert('Event deleted!');
            // Perform delete operation here
        }
    };

    const handleEdit = () => {
        navigate(`/app/events/add-edit/${event._id}`);
    };

    // const handleShare = () => {
    //     alert('Event shared!');
    //     // Perform share operation here
    // };

    const handleReview = () => {
        alert('Review submitted!');
        // Perform review operation here
    };

    return (
        <div className="container mx-auto">
            {loading && <Loading/>}
            <section>
                {!event._id && <NoData text={"Event Not Found!"}/>}
                {event._id && <Card shadow="sm" padding="lg">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column: Event Image */}
                        <div className="col-span-12 lg:col-span-6">
                            <Image
                                src={event?.image_url}
                                alt={event?.title}
                                radius="md"
                                style={{width: '100%', height: '100%'}}
                            />
                        </div>

                        {/* Right Column: Event Details */}
                        <div className="col-span-12 lg:col-span-6">
                            <Text fw="700" size="xl" mb="sm">
                                {event?.title}
                            </Text>
                            <Text size="sm"
                                  color="dimmed">{moment(event?.start_date).format("YYYY-MM-DD")} {event?.end_date ? ` - ${moment(event?.end_date).format("YYYY-MM-DD")}` : ""}</Text>
                            <Text size="md" mb="xl">
                                {event.description}
                            </Text>
                            <CategoryTags categories={event?.category}></CategoryTags>

                            {/* Buttons: Edit, Delete, Share, Review */}
                            <Group gap="md" mb="xl" mt="xl">
                                {loggedInUserId === event?.user &&
                                    <Button variant="light" onClick={handleEdit}>
                                        Edit
                                    </Button>}
                                {loggedInUserId === event?.user &&
                                    <Button color="red" onClick={handleDelete}>
                                        Delete
                                    </Button>}
                                <ShareMenu url={url} title={event?.title}/>
                            </Group>

                            {/* Review Section */}
                            {loggedInUserId !== event?.user && <div>
                                <Text fw="600" size="lg" mb="sm">
                                    Reviews
                                </Text>
                                <Textarea
                                    placeholder="Write your review..."
                                    mb="md"
                                />
                                <Button color="black" onClick={handleReview}>Submit Review</Button>
                            </div>}
                        </div>
                    </div>
                </Card>}
            </section>
        </div>
    );
};

export default EventDetails;
