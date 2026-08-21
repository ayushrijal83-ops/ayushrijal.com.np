/**
 * The Home island.
 *
 * One job: boot System A, the custom wordmark layout. That is the entire
 * client-side surface of this page.
 *
 * It used to also boot a Pretext-driven editorial field that set the standfirst
 * around the wordmark's measured geometry. That was removed on measurement,
 * not on taste — with the approved copy the text never leaves the masthead's
 * vertical band, so a CSS float produces the identical result natively and
 * without an island. See PROJECT_PROGRESS §1B.5.
 */

import { mountWordmarks } from './wordmark.js';

void mountWordmarks();
