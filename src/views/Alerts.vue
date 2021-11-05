<template>
    <div>
        <div v-if="rolling">
            <ul
                class="
                    absolute
                    left-1/2
                    right-1/2
                    top-16
                    flex flex-col
                    items-center
                    justify-center
                    gap-6
                "
            >
                <li v-for="donor in donors" :key="donor">
                    <p class="text-white font-bold text-5xl">{{ donor }}</p>
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
            donors.value = ['EverydayKenway', 'BSKnuckles']
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
                    console.log(data)
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
                        donors.value = highRollers.map(
                            (donor) => donor.displayName
                        )
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
</style>
