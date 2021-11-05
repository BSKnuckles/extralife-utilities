<template>
    <div>
        <div v-if="rolling">
            <ul
                class="
                    absolute
                    left-1/2
                    right-1/2
                    top-32
                    flex flex-col
                    items-center
                    justify-center
                    gap-6
                "
            >
                <li v-for="donor in donors" :key="donor.name">
                    <p
                        class="
                            donorNames
                            text-white
                            font-bold
                            text-4xl text-center
                            whitespace-nowrap
                        "
                    >
                        {{ donor.name }} donated ${{ donor.amount.toFixed(2) }}
                    </p>
                </li>
            </ul>
            <video width="1920" height="1080" autoplay>
                <source src="/HighRoller.mp4" type="video/mp4" />
            </video>
        </div>
        <button
            @click="testNotification"
            class="
                absolute
                bottom-0
                right-0
                bg-transparent
                text-transparent
                p-8
            "
        >
            Test Notificaton
        </button>
    </div>
</template>

<script>
import Moment from 'moment'
import { ref } from 'vue'

export default {
    setup() {
        const refresh = 30000 // in ms (60,000 = 1 minute)
        const participantId = 451384
        const rolling = ref(false)
        const testing = ref(false)
        const donors = ref([])
        const url = `https://extra-life.org/api/participants/${participantId}/donations`

        const testNotification = () => {
            console.log('Triggering test notification')
            rolling.value = true
            testing.value = true
            donors.value = [
                { name: 'EverydayKenway', amount: 133.7 },
                { name: 'BSKnuckles', amount: 80081.35 },
            ]
            setTimeout(() => {
                rolling.value = false
                testing.value = false
                donors.value = []
            }, 15000)
        }

        const fetchDonations = () => {
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    let highRollers = data.filter((donation) => {
                        let donationTime = Moment(donation.createdDateUTC)
                        let reference = Moment()
                        if (
                            donation.amount >= 100 &&
                            reference.diff(donationTime) <= refresh
                        ) {
                            return true
                        }
                    })
                    if (highRollers.length > 0) {
                        rolling.value = true
                        donors.value = highRollers.map((donor) => {
                            return {
                                name: donor.displayName,
                                amount: donor.amount,
                            }
                        })
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        rolling.value = false
                        donors.value = []
                    }, 15000)
                })
        }
        // Fetch donations at the refresh rate
        setInterval(() => {
            console.log('Fetching donations', new Date())
            fetchDonations()
        }, refresh)

        return { donors, rolling, testNotification }
    },
}
</script>

<style>
body {
    background-color: transparent;
}
.donorNames {
    opacity: 0;
    animation: fade 8s linear;
    animation-delay: 7s;
}
@keyframes fade {
    0% {
        opacity: 0;
    }
    5% {
        opacity: 0.75;
    }
    50% {
        opacity: 1;
    }
    95% {
        opacity: 0.75;
    }
    100% {
        opacity: 0;
    }
}
</style>
